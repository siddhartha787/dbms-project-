const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [[{ total_bookings }]] = await db.query('SELECT COUNT(*) AS total_bookings FROM bookings');
        const [[{ confirmed }]] = await db.query("SELECT COUNT(*) AS confirmed FROM bookings WHERE status='Confirmed'");
        const [[{ cancelled }]] = await db.query("SELECT COUNT(*) AS cancelled FROM bookings WHERE status='Cancelled'");
        const [[{ waitlisted }]] = await db.query("SELECT COUNT(*) AS waitlisted FROM bookings WHERE status='Waitlisted'");
        const [[{ total_revenue }]] = await db.query("SELECT COALESCE(SUM(total_fare),0) AS total_revenue FROM bookings WHERE status != 'Cancelled'");
        const [[{ total_users }]] = await db.query("SELECT COUNT(*) AS total_users FROM users WHERE role='passenger'");
        const [[{ total_trains }]] = await db.query("SELECT COUNT(*) AS total_trains FROM trains WHERE status='Active'");
        const [[{ total_stations }]] = await db.query("SELECT COUNT(*) AS total_stations FROM stations");
        const [[{ refunds_issued }]] = await db.query("SELECT COALESCE(SUM(refund_amount),0) AS refunds_issued FROM bookings WHERE status='Cancelled'");

        // Monthly revenue (last 6 months)
        const [monthlyRevenue] = await db.query(`
            SELECT DATE_FORMAT(booking_date, '%b %Y') AS month, 
                   SUM(total_fare) AS revenue, COUNT(*) AS count
            FROM bookings WHERE status != 'Cancelled'
            GROUP BY YEAR(booking_date), MONTH(booking_date)
            ORDER BY YEAR(booking_date), MONTH(booking_date)
            LIMIT 6
        `);

        // Top trains by bookings
        const [topTrains] = await db.query(`
            SELECT t.train_name, t.train_number, COUNT(b.booking_id) AS booking_count, SUM(b.total_fare) AS revenue
            FROM bookings b JOIN trains t ON b.train_id = t.train_id
            WHERE b.status != 'Cancelled'
            GROUP BY t.train_id ORDER BY booking_count DESC LIMIT 5
        `);

        res.json({
            success: true,
            stats: { total_bookings, confirmed, cancelled, waitlisted, total_revenue, total_users, total_trains, total_stations, refunds_issued },
            monthly_revenue: monthlyRevenue,
            top_trains: topTrains
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/bookings - All bookings
router.get('/bookings', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const status = req.query.status || '';
        const search = req.query.search || '';

        let where = [];
        const params = [];

        if (status) { where.push('b.status = ?'); params.push(status); }
        if (search) {
            where.push('(b.pnr_number LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereStr = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

        const [bookings] = await db.query(`
            SELECT b.*, u.full_name, u.email, u.phone,
                t.train_number, t.train_name, tc.class_code,
                fs.station_name AS from_station, ts.station_name AS to_station
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            JOIN trains t ON b.train_id = t.train_id
            JOIN train_classes tc ON b.class_id = tc.class_id
            JOIN stations fs ON b.from_station_id = fs.station_id
            JOIN stations ts ON b.to_station_id = ts.station_id
            ${whereStr}
            ORDER BY b.booking_date DESC
            LIMIT ? OFFSET ?
        `, [...params, limit, offset]);

        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) AS total FROM bookings b 
             JOIN users u ON b.user_id = u.user_id ${whereStr}`,
            params
        );

        res.json({ success: true, bookings, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/users - All users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.user_id, u.full_name, u.email, u.phone, u.role, u.gender, u.dob, u.created_at,
                COUNT(b.booking_id) AS total_bookings,
                COALESCE(SUM(CASE WHEN b.status != 'Cancelled' THEN b.total_fare ELSE 0 END), 0) AS total_spent
            FROM users u
            LEFT JOIN bookings b ON u.user_id = b.user_id
            GROUP BY u.user_id
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/admin/trains - Add a train
router.post('/trains', async (req, res) => {
    try {
        const { train_number, train_name, train_type, total_seats } = req.body;
        const [result] = await db.query(
            'INSERT INTO trains (train_number, train_name, train_type, total_seats) VALUES (?, ?, ?, ?)',
            [train_number, train_name, train_type, total_seats]
        );
        await db.query('INSERT INTO admin_logs (admin_id, action, table_name, record_id) VALUES (?, ?, ?, ?)',
            [req.user.user_id, 'Added train', 'trains', result.insertId]);
        res.status(201).json({ success: true, message: 'Train added', train_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/admin/trains/:id - Update train
router.put('/trains/:id', async (req, res) => {
    try {
        const { train_name, train_type, total_seats, status } = req.body;
        await db.query(
            'UPDATE trains SET train_name=?, train_type=?, total_seats=?, status=? WHERE train_id=?',
            [train_name, train_type, total_seats, status, req.params.id]
        );
        await db.query('INSERT INTO admin_logs (admin_id, action, table_name, record_id) VALUES (?, ?, ?, ?)',
            [req.user.user_id, 'Updated train', 'trains', req.params.id]);
        res.json({ success: true, message: 'Train updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/admin/trains/:id
router.delete('/trains/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM trains WHERE train_id = ?', [req.params.id]);
        await db.query('INSERT INTO admin_logs (admin_id, action, table_name, record_id) VALUES (?, ?, ?, ?)',
            [req.user.user_id, 'Deleted train', 'trains', req.params.id]);
        res.json({ success: true, message: 'Train deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/admin/stations - Add station
router.post('/stations', async (req, res) => {
    try {
        const { station_code, station_name, city, state, zone } = req.body;
        const [result] = await db.query(
            'INSERT INTO stations (station_code, station_name, city, state, zone) VALUES (?, ?, ?, ?, ?)',
            [station_code, station_name, city, state, zone]
        );
        res.status(201).json({ success: true, message: 'Station added', station_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/admin/stations/:id
router.put('/stations/:id', async (req, res) => {
    try {
        const { station_code, station_name, city, state, zone } = req.body;
        await db.query(
            'UPDATE stations SET station_code=?, station_name=?, city=?, state=?, zone=? WHERE station_id=?',
            [station_code, station_name, city, state, zone, req.params.id]
        );
        res.json({ success: true, message: 'Station updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/cancellations
router.get('/cancellations', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, b.pnr_number, b.total_fare, b.journey_date,
                u.full_name AS cancelled_by_name,
                t.train_name, t.train_number
            FROM cancellations c
            JOIN bookings b ON c.booking_id = b.booking_id
            JOIN users u ON c.cancelled_by = u.user_id
            JOIN trains t ON b.train_id = t.train_id
            ORDER BY c.created_at DESC
        `);
        res.json({ success: true, cancellations: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/logs
router.get('/logs', async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT al.*, u.full_name AS admin_name
            FROM admin_logs al JOIN users u ON al.admin_id = u.user_id
            ORDER BY al.created_at DESC LIMIT 100
        `);
        res.json({ success: true, logs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
