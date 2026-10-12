const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/bookings - Create a new booking
router.post('/', authenticateToken, async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const rawTrainId = req.body.train_id;
        const rawClassId = req.body.class_id;
        const rawFrom = req.body.from_station_id || req.body.from_station || req.body.from;
        const rawTo = req.body.to_station_id || req.body.to_station || req.body.to;
        const journey_date = req.body.journey_date || req.body.date || new Date().toISOString().split('T')[0];
        const passengers = req.body.passengers;
        const payment_mode = req.body.payment_mode || req.body.payment_method || 'UPI';

        if (!rawTrainId || !rawClassId || !rawFrom || !rawTo || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Missing required fields (train, class, from, to, passengers)' });
        }

        const train_id = parseInt(rawTrainId);
        const class_id = parseInt(rawClassId);

        // Helper to resolve station
        async function resolveStation(val) {
            if (!val) return null;
            if (/^\d+$/.test(String(val).trim())) return parseInt(val);
            const str = String(val).trim();
            const [rows] = await conn.query(
                'SELECT station_id FROM stations WHERE UPPER(station_code) = UPPER(?) OR LOWER(station_name) = LOWER(?) LIMIT 1',
                [str, str]
            );
            return rows.length > 0 ? rows[0].station_id : null;
        }

        const from_station_id = await resolveStation(rawFrom);
        const to_station_id = await resolveStation(rawTo);

        if (!from_station_id || !to_station_id) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Invalid stations provided' });
        }

        // Get distance and fare
        const [r1] = await conn.query(
            'SELECT distance_from_origin FROM routes WHERE train_id = ? AND station_id = ?',
            [train_id, from_station_id]
        );
        const [r2] = await conn.query(
            'SELECT distance_from_origin FROM routes WHERE train_id = ? AND station_id = ?',
            [train_id, to_station_id]
        );

        if (r1.length === 0 || r2.length === 0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Train does not operate between selected stations' });
        }

        const distance = Math.max(1, Math.abs(r2[0].distance_from_origin - r1[0].distance_from_origin));
        const [classInfo] = await conn.query('SELECT * FROM train_classes WHERE class_id = ?', [class_id]);
        if (classInfo.length === 0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Invalid class' });
        }

        const farePerPassenger = Math.round(classInfo[0].fare_per_km * distance * 100) / 100;
        const totalFare = req.body.total_fare ? parseFloat(req.body.total_fare) : (farePerPassenger * passengers.length);

        // Check/create seat availability
        let [avail] = await conn.query(
            'SELECT * FROM seat_availability WHERE train_id=? AND class_id=? AND journey_date=?',
            [train_id, class_id, journey_date]
        );

        if (avail.length === 0) {
            await conn.query(
                'INSERT INTO seat_availability (train_id, class_id, journey_date, available_seats, rac_seats, waitlist_count) VALUES (?, ?, ?, ?, 0, 0)',
                [train_id, class_id, journey_date, classInfo[0].total_seats]
            );
            [avail] = await conn.query(
                'SELECT * FROM seat_availability WHERE train_id=? AND class_id=? AND journey_date=?',
                [train_id, class_id, journey_date]
            );
        }

        const { available_seats, rac_seats, waitlist_count } = avail[0];
        let bookingStatus;

        if (available_seats >= passengers.length) {
            bookingStatus = 'Confirmed';
            await conn.query(
                'UPDATE seat_availability SET available_seats=available_seats-? WHERE train_id=? AND class_id=? AND journey_date=?',
                [passengers.length, train_id, class_id, journey_date]
            );
        } else if (rac_seats < 10) {
            bookingStatus = 'RAC';
            await conn.query(
                'UPDATE seat_availability SET rac_seats=rac_seats+? WHERE train_id=? AND class_id=? AND journey_date=?',
                [passengers.length, train_id, class_id, journey_date]
            );
        } else {
            bookingStatus = 'Waitlisted';
            await conn.query(
                'UPDATE seat_availability SET waitlist_count=waitlist_count+? WHERE train_id=? AND class_id=? AND journey_date=?',
                [passengers.length, train_id, class_id, journey_date]
            );
        }

        // Generate PNR
        const pnr = String(Math.floor(Math.random() * 9000000000) + 1000000000);
        const transactionId = 'TXN' + Date.now();

        const [bookingResult] = await conn.query(
            `INSERT INTO bookings (pnr_number, user_id, train_id, class_id, from_station_id, to_station_id, journey_date, total_fare, status, payment_mode, transaction_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [pnr, req.user.user_id, train_id, class_id, from_station_id, to_station_id, journey_date, totalFare, bookingStatus, payment_mode, transactionId]
        );

        const bookingId = bookingResult.insertId;

        // Insert passengers
        const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
        const seatNumbers = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];
        const validIds = ['Aadhar', 'PAN', 'Passport', 'DL', 'Voter ID'];
        const validBerths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window', 'Aisle'];

        for (let i = 0; i < passengers.length; i++) {
            const p = passengers[i];
            const pName = (p.name || p.full_name || p.passenger_name || `Passenger ${i + 1}`).trim();
            const pAge = parseInt(p.age) || 28;
            
            let pGender = 'Male';
            if (p.gender && ['female', 'f'].includes(String(p.gender).toLowerCase())) pGender = 'Female';
            else if (p.gender && ['other', 'o'].includes(String(p.gender).toLowerCase())) pGender = 'Other';

            let idType = 'Aadhar';
            if (p.id_type) {
                if (validIds.includes(p.id_type)) idType = p.id_type;
                else if (/aadh/i.test(p.id_type)) idType = 'Aadhar';
                else if (/pan/i.test(p.id_type)) idType = 'PAN';
                else if (/pass/i.test(p.id_type)) idType = 'Passport';
                else if (/dl|driv/i.test(p.id_type)) idType = 'DL';
                else if (/vot/i.test(p.id_type)) idType = 'Voter ID';
            }

            let berth = berths[i % berths.length];
            if (p.berth_preference && validBerths.includes(p.berth_preference)) berth = p.berth_preference;
            if (p.berth_type && validBerths.includes(p.berth_type)) berth = p.berth_type;

            const seatNum = bookingStatus === 'Confirmed' ? (p.seat_number || `${seatNumbers[i % 8]}/${i + 1}`) : null;

            let wlNum = null, racNum = null;
            if (bookingStatus === 'Waitlisted') wlNum = waitlist_count + i + 1;
            if (bookingStatus === 'RAC') racNum = rac_seats + i + 1;

            await conn.query(
                `INSERT INTO passengers (booking_id, name, age, gender, seat_number, berth_type, status, waitlist_number, rac_number, id_type, id_number, is_senior)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [bookingId, pName, pAge, pGender, seatNum, berth, bookingStatus, wlNum, racNum, idType, p.id_number || '', pAge >= 60 ? 1 : 0]
            );
        }

        // Notification
        await conn.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [req.user.user_id, 'Booking Confirmed', `PNR: ${pnr} | Status: ${bookingStatus} | Fare: ₹${totalFare}`, 'Booking']
        );

        await conn.commit();

        res.status(201).json({
            success: true,
            message: `Booking ${bookingStatus}`,
            pnr_number: pnr,
            booking_id: bookingId,
            status: bookingStatus,
            total_fare: totalFare,
            transaction_id: transactionId,
            booking: {
                booking_id: bookingId,
                pnr_number: pnr,
                status: bookingStatus,
                total_fare: totalFare,
                journey_date,
                payment_mode,
                transaction_id: transactionId
            }
        });
    } catch (err) {
        await conn.rollback();
        console.error('Booking creation error:', err);
        res.status(500).json({ success: false, message: err.message });
    } finally {
        conn.release();
    }
});

// GET /api/bookings/my-bookings - Alias
router.get('/my-bookings', authenticateToken, async (req, res, next) => {
    req.url = '/';
    router.handle(req, res, next);
});

// GET /api/bookings - Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, 
                t.train_number, t.train_name, t.train_type,
                tc.class_code, tc.class_name,
                fs.station_name AS from_station, fs.city AS from_city,
                ts.station_name AS to_station, ts.city AS to_city
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN stations fs ON b.from_station_id = fs.station_id
            JOIN stations ts ON b.to_station_id = ts.station_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `, [req.user.user_id]);

        // Attach passengers
        const result = [];
        for (const booking of bookings) {
            const [passengers] = await db.query(
                'SELECT * FROM passengers WHERE booking_id = ?',
                [booking.booking_id]
            );
            result.push({ ...booking, passengers });
        }

        res.json({ success: true, bookings: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/bookings/pnr/:pnr - PNR status check
router.get('/pnr/:pnr', async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, 
                u.full_name, u.phone,
                t.train_number, t.train_name, t.train_type,
                tc.class_code, tc.class_name,
                fs.station_name AS from_station, fs.city AS from_city, fs.station_code AS from_code,
                ts.station_name AS to_station, ts.city AS to_city, ts.station_code AS to_code
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN stations fs ON b.from_station_id = fs.station_id
            JOIN stations ts ON b.to_station_id = ts.station_id
            WHERE b.pnr_number = ?
        `, [req.params.pnr]);

        if (bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'PNR not found' });
        }

        const [passengers] = await db.query(
            'SELECT * FROM passengers WHERE booking_id = ?',
            [bookings[0].booking_id]
        );

        res.json({ success: true, booking: { ...bookings[0], passengers } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, 
                t.train_number, t.train_name, t.train_type,
                tc.class_code, tc.class_name,
                fs.station_name AS from_station, fs.city AS from_city, fs.station_code AS from_code,
                ts.station_name AS to_station, ts.city AS to_city, ts.station_code AS to_code
            FROM bookings b
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN stations fs ON b.from_station_id = fs.station_id
            JOIN stations ts ON b.to_station_id = ts.station_id
            WHERE b.booking_id = ? AND b.user_id = ?
        `, [req.params.id, req.user.user_id]);

        if (bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const [passengers] = await db.query(
            'SELECT * FROM passengers WHERE booking_id = ?',
            [req.params.id]
        );

        res.json({ success: true, booking: { ...bookings[0], passengers } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { reason } = req.body;
        const [bookings] = await conn.query(
            'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?',
            [req.params.id, req.user.user_id]
        );

        if (bookings.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookings[0];
        if (booking.status === 'Cancelled') {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });
        }

        // Calculate refund
        const daysLeft = Math.floor((new Date(booking.journey_date) - new Date()) / (1000 * 60 * 60 * 24));
        let chargePct;
        if (daysLeft >= 48) chargePct = 0.25;
        else if (daysLeft >= 12) chargePct = 0.50;
        else chargePct = 1.00;

        const charge = booking.total_fare * chargePct;
        const refund = Math.max(0, booking.total_fare - charge);

        await conn.query(
            `UPDATE bookings SET status='Cancelled', payment_status='Refunded', cancelled_at=NOW(), 
             refund_amount=?, cancellation_reason=? WHERE booking_id=?`,
            [refund, reason || 'Cancelled by user', req.params.id]
        );

        await conn.query('UPDATE passengers SET status="Cancelled" WHERE booking_id=?', [req.params.id]);

        await conn.query(
            `INSERT INTO cancellations (booking_id, cancelled_by, cancel_reason, refund_amount, cancellation_charges)
             VALUES (?, ?, ?, ?, ?)`,
            [req.params.id, req.user.user_id, reason || 'Cancelled by user', refund, charge]
        );

        // Restore seat
        if (booking.status === 'Confirmed') {
            const [passengers] = await conn.query('SELECT COUNT(*) AS cnt FROM passengers WHERE booking_id=?', [req.params.id]);
            await conn.query(
                'UPDATE seat_availability SET available_seats=available_seats+? WHERE train_id=? AND class_id=? AND journey_date=?',
                [passengers[0].cnt, booking.train_id, booking.class_id, booking.journey_date]
            );
        }

        await conn.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [req.user.user_id, 'Booking Cancelled', `PNR: ${booking.pnr_number}. Refund of ₹${refund} initiated.`, 'Cancellation']
        );

        await conn.commit();
        res.json({ success: true, message: 'Booking cancelled', refund_amount: refund, cancellation_charges: charge });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ success: false, message: err.message });
    } finally {
        conn.release();
    }
});

// GET /api/bookings/user/notifications
router.get('/user/notifications', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 20',
            [req.user.user_id]
        );
        res.json({ success: true, notifications: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/bookings/notifications/read-all
router.put('/notifications/read-all', authenticateToken, async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read=1 WHERE user_id=?', [req.user.user_id]);
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
