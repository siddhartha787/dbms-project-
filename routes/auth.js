const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, phone, password, gender, dob, address } = req.body;
        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone, password_hash, gender, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, phone, hash, gender || 'Male', dob || null, address || null]
        );

        res.status(201).json({ success: true, message: 'Registration successful', user_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role, full_name: user.full_name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { user_id: user.user_id, full_name: user.full_name, email: user.email, role: user.role, phone: user.phone }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/auth/profile
const { authenticateToken } = require('../middleware/auth');
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT user_id, full_name, email, phone, gender, dob, address, role, created_at FROM users WHERE user_id = ?',
            [req.user.user_id]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { full_name, phone, gender, dob, address } = req.body;
        await db.query(
            'UPDATE users SET full_name=?, phone=?, gender=?, dob=?, address=? WHERE user_id=?',
            [full_name, phone, gender, dob, address, req.user.user_id]
        );
        res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
