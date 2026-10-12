const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/trains/stations - Get all stations
router.get('/stations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM stations ORDER BY station_name');
        res.json({ success: true, stations: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/trains/search - Search trains between stations
router.get('/search', async (req, res) => {
    try {
        const rawFrom = req.query.from_station || req.query.from || req.query.from_station_id;
        const rawTo = req.query.to_station || req.query.to || req.query.to_station_id;
        const journey_date = req.query.journey_date || req.query.date || new Date().toISOString().split('T')[0];

        if (!rawFrom || !rawTo) {
            return res.status(400).json({ success: false, message: 'from and to stations are required' });
        }

        // Helper to resolve station ID from ID, code, or name
        async function resolveStationId(val) {
            if (!val) return null;
            if (/^\d+$/.test(String(val).trim())) {
                return parseInt(val);
            }
            const str = String(val).trim();
            const [rows] = await db.query(
                'SELECT station_id FROM stations WHERE UPPER(station_code) = UPPER(?) OR LOWER(station_name) = LOWER(?) LIMIT 1',
                [str, str]
            );
            return rows.length > 0 ? rows[0].station_id : null;
        }

        const from_station = await resolveStationId(rawFrom);
        const to_station = await resolveStationId(rawTo);

        if (!from_station || !to_station) {
            return res.status(400).json({ 
                success: false, 
                message: `Could not resolve station: ${!from_station ? rawFrom : rawTo}` 
            });
        }

        const [trains] = await db.query(`
            SELECT DISTINCT
                t.train_id,
                t.train_number,
                t.train_name,
                t.train_type,
                t.status,
                r1.departure_time AS departure,
                r2.arrival_time AS arrival,
                (r2.distance_from_origin - r1.distance_from_origin) AS distance_km,
                fs.station_id AS from_station_id,
                ts.station_id AS to_station_id,
                fs.station_name AS from_station_name,
                ts.station_name AS to_station_name,
                fs.station_code AS from_station_code,
                ts.station_code AS to_station_code
            FROM trains t
            JOIN routes r1 ON t.train_id = r1.train_id AND r1.station_id = ?
            JOIN routes r2 ON t.train_id = r2.train_id AND r2.station_id = ?
            JOIN stations fs ON r1.station_id = fs.station_id
            JOIN stations ts ON r2.station_id = ts.station_id
            WHERE r1.sequence_no < r2.sequence_no
              AND t.status = 'Active'
        `, [from_station, to_station]);

        // If direct trains are found, attach classes and return
        if (trains.length > 0) {
            const results = [];
            for (const train of trains) {
                const [classes] = await db.query(`
                    SELECT 
                        tc.class_id, tc.class_code, tc.class_name, tc.total_seats, tc.fare_per_km,
                        COALESCE(sa.available_seats, tc.total_seats) AS available_seats,
                        COALESCE(sa.rac_seats, 0) AS rac_seats,
                        COALESCE(sa.waitlist_count, 0) AS waitlist_count,
                        ROUND(tc.fare_per_km * ?, 2) AS estimated_fare
                    FROM train_classes tc
                    LEFT JOIN seat_availability sa ON tc.class_id = sa.class_id 
                        AND sa.train_id = ? AND sa.journey_date = ?
                    WHERE tc.train_id = ?
                `, [train.distance_km, train.train_id, journey_date, train.train_id]);

                results.push({ ...train, classes, is_direct: true });
            }
            return res.json({ 
                success: true, 
                trains: results, 
                direct_trains: results,
                count: results.length, 
                is_direct: true 
            });
        }

        // --- SMART FALLBACK 1: Connecting routes via transfer junction ---
        const [connectingRows] = await db.query(`
            SELECT 
                t1.train_id AS leg1_train_id, t1.train_number AS leg1_num, t1.train_name AS leg1_name, t1.train_type AS leg1_type,
                r1_start.departure_time AS leg1_departure, r1_end.arrival_time AS leg1_arrival,
                (r1_end.distance_from_origin - r1_start.distance_from_origin) AS leg1_dist,
                junc.station_id AS junction_id, junc.station_name AS junction_name, junc.station_code AS junction_code,
                t2.train_id AS leg2_train_id, t2.train_number AS leg2_num, t2.train_name AS leg2_name, t2.train_type AS leg2_type,
                r2_start.departure_time AS leg2_departure, r2_end.arrival_time AS leg2_arrival,
                (r2_end.distance_from_origin - r2_start.distance_from_origin) AS leg2_dist,
                fs.station_name AS from_station_name, ts.station_name AS to_station_name
            FROM routes r1_start
            JOIN routes r1_end ON r1_start.train_id = r1_end.train_id AND r1_start.sequence_no < r1_end.sequence_no
            JOIN stations junc ON r1_end.station_id = junc.station_id
            JOIN routes r2_start ON r2_start.station_id = junc.station_id
            JOIN routes r2_end ON r2_start.train_id = r2_end.train_id AND r2_start.sequence_no < r2_end.sequence_no AND r2_end.station_id = ?
            JOIN trains t1 ON r1_start.train_id = t1.train_id AND t1.status = 'Active'
            JOIN trains t2 ON r2_start.train_id = t2.train_id AND t2.status = 'Active' AND t1.train_id != t2.train_id
            JOIN stations fs ON r1_start.station_id = fs.station_id
            JOIN stations ts ON r2_end.station_id = ts.station_id
            WHERE r1_start.station_id = ?
            LIMIT 6
        `, [to_station, from_station]);

        const connectingOptions = [];
        for (const conn of connectingRows) {
            const [classes1] = await db.query(`
                SELECT class_id, class_code, class_name, total_seats, fare_per_km,
                       ROUND(fare_per_km * ?, 2) AS estimated_fare
                FROM train_classes WHERE train_id = ? LIMIT 3
            `, [conn.leg1_dist, conn.leg1_train_id]);

            const [classes2] = await db.query(`
                SELECT class_id, class_code, class_name, total_seats, fare_per_km,
                       ROUND(fare_per_km * ?, 2) AS estimated_fare
                FROM train_classes WHERE train_id = ? LIMIT 3
            `, [conn.leg2_dist, conn.leg2_train_id]);

            connectingOptions.push({
                ...conn,
                total_distance_km: (parseFloat(conn.leg1_dist) || 0) + (parseFloat(conn.leg2_dist) || 0),
                leg1_classes: classes1,
                leg2_classes: classes2
            });
        }

        // --- SMART FALLBACK 2: Popular express trains running from the origin station ---
        const [originTrains] = await db.query(`
            SELECT DISTINCT t.train_id, t.train_number, t.train_name, t.train_type, t.status,
                   r.departure_time AS departure, fs.station_name AS from_station_name
            FROM trains t
            JOIN routes r ON t.train_id = r.train_id AND r.station_id = ?
            JOIN stations fs ON r.station_id = fs.station_id
            WHERE t.status = 'Active'
            LIMIT 6
        `, [from_station]);

        const originResults = [];
        for (const ot of originTrains) {
            const [classes] = await db.query('SELECT * FROM train_classes WHERE train_id = ?', [ot.train_id]);
            originResults.push({ ...ot, classes });
        }

        res.json({
            success: true,
            trains: [],
            count: 0,
            is_direct: false,
            connecting_options: connectingOptions,
            origin_trains: originResults
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/trains - Get all trains with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        let query = `SELECT t.*, 
            (SELECT COUNT(*) FROM train_classes WHERE train_id = t.train_id) AS class_count,
            (SELECT COUNT(*) FROM routes WHERE train_id = t.train_id) AS stop_count
            FROM trains t`;
        const params = [];

        if (search) {
            query += ` WHERE t.train_number LIKE ? OR t.train_name LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY t.train_number LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [trains] = await db.query(query, params);
        const [[{ total }]] = await db.query(
            `SELECT COUNT(*) AS total FROM trains ${search ? 'WHERE train_number LIKE ? OR train_name LIKE ?' : ''}`,
            search ? [`%${search}%`, `%${search}%`] : []
        );

        res.json({ success: true, trains, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/trains/:id - Get train details with route
router.get('/:id', async (req, res) => {
    try {
        const [trains] = await db.query('SELECT * FROM trains WHERE train_id = ?', [req.params.id]);
        if (trains.length === 0) return res.status(404).json({ success: false, message: 'Train not found' });

        const [route] = await db.query(`
            SELECT r.*, s.station_code, s.station_name, s.city, s.state
            FROM routes r JOIN stations s ON r.station_id = s.station_id
            WHERE r.train_id = ? ORDER BY r.sequence_no
        `, [req.params.id]);

        const [classes] = await db.query(
            'SELECT * FROM train_classes WHERE train_id = ? ORDER BY class_code',
            [req.params.id]
        );

        const [schedule] = await db.query(
            'SELECT * FROM train_schedule WHERE train_id = ?',
            [req.params.id]
        );

        res.json({ success: true, train: trains[0], route, classes, schedule: schedule[0] || null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/trains/:id/availability - Seat availability
router.get('/:id/availability', async (req, res) => {
    try {
        const { journey_date } = req.query;
        if (!journey_date) return res.status(400).json({ success: false, message: 'journey_date required' });

        const [rows] = await db.query(`
            SELECT tc.class_id, tc.class_code, tc.class_name, tc.total_seats, tc.fare_per_km,
                COALESCE(sa.available_seats, tc.total_seats) AS available_seats,
                COALESCE(sa.rac_seats, 0) AS rac_seats,
                COALESCE(sa.waitlist_count, 0) AS waitlist_count
            FROM train_classes tc
            LEFT JOIN seat_availability sa ON tc.class_id = sa.class_id 
                AND sa.train_id = ? AND sa.journey_date = ?
            WHERE tc.train_id = ?
        `, [req.params.id, journey_date, req.params.id]);

        res.json({ success: true, availability: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
