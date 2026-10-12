// ============================================================
// Add Comprehensive Indian Railway Trains, Express, Superfast,
// Vande Bharat, Rajdhani, Shatabdi, Garib Rath, Mail & Intercity
// Across India (connecting North, South, East, West, Central)
// ============================================================

const db = require('./db');

async function seedMassiveTrains() {
    console.log('🚀 Seeding comprehensive Pan-India train network...');

    // Fetch stations mapping
    const [stationRows] = await db.query('SELECT station_id, station_code FROM stations');
    const smap = {};
    stationRows.forEach(r => smap[r.station_code] = r.station_id);

    const trainsData = [
        // 1. NDLS - BCT (Delhi - Mumbai Western Trunk Route)
        {
            number: '12952',
            name: 'Mumbai New Delhi Rajdhani Express',
            type: 'Rajdhani',
            total_seats: 1100,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 52, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.95 }
            ],
            stops: [
                { code: 'BCT', arr: null, dep: '17:00:00', dist: 0, plat: 1 },
                { code: 'ST', arr: '19:25:00', dep: '19:28:00', dist: 263, plat: 1 },
                { code: 'BRC', arr: '20:53:00', dep: '20:58:00', dist: 392, plat: 2 },
                { code: 'RTM', arr: '00:15:00', dep: '00:18:00', dist: 653, plat: 1 },
                { code: 'KOTA', arr: '03:15:00', dep: '03:20:00', dist: 920, plat: 1 },
                { code: 'NDLS', arr: '08:35:00', dep: null, dist: 1384, plat: 2 }
            ]
        },
        // 2. NDLS - HWH (Delhi - Kolkata Eastern Trunk Route)
        {
            number: '12302',
            name: 'Howrah New Delhi Rajdhani Express (via Gaya)',
            type: 'Rajdhani',
            total_seats: 1100,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 52, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.95 }
            ],
            stops: [
                { code: 'HWH', arr: null, dep: '16:50:00', dist: 0, plat: 9 },
                { code: 'ASN', arr: '18:57:00', dep: '19:00:00', dist: 200, plat: 4 },
                { code: 'DHN', arr: '19:55:00', dep: '20:00:00', dist: 259, plat: 1 },
                { code: 'GAYA', arr: '22:19:00', dep: '22:22:00', dist: 458, plat: 1 },
                { code: 'MGS', arr: '00:45:00', dep: '00:55:00', dist: 663, plat: 2 },
                { code: 'PRYJ', arr: '02:33:00', dep: '02:35:00', dist: 816, plat: 1 },
                { code: 'CNB', arr: '04:40:00', dep: '04:45:00', dist: 1010, plat: 1 },
                { code: 'NDLS', arr: '09:55:00', dep: null, dist: 1447, plat: 13 }
            ]
        },
        // 3. Purushottam Express (NDLS - CNB - PRYJ - BSB - MGS - GAYA - BKSC - TATA - BBS - PURI)
        {
            number: '12802',
            name: 'Purushottam Express (NDLS - PURI)',
            type: 'Superfast',
            total_seats: 1850,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 18, fare_per_km: 4.5 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '22:40:00', dist: 0, plat: 8 },
                { code: 'CNB', arr: '04:00:00', dep: '04:05:00', dist: 440, plat: 2 },
                { code: 'PRYJ', arr: '06:55:00', dep: '07:00:00', dist: 635, plat: 4 },
                { code: 'MGS', arr: '09:50:00', dep: '10:00:00', dist: 787, plat: 1 },
                { code: 'GAYA', arr: '12:35:00', dep: '12:40:00', dist: 990, plat: 2 },
                { code: 'BKSC', arr: '15:25:00', dep: '15:30:00', dist: 1140, plat: 1 },
                { code: 'TATA', arr: '18:15:00', dep: '18:25:00', dist: 1290, plat: 3 },
                { code: 'CTC', arr: '01:05:00', dep: '01:10:00', dist: 1690, plat: 4 },
                { code: 'BBS', arr: '01:45:00', dep: '01:50:00', dist: 1718, plat: 3 },
                { code: 'PURI', arr: '05:25:00', dep: null, dist: 1781, plat: 2 }
            ]
        },
        // 4. Grand Trunk Express (NDLS - AGC - GWL - JHS - BPL - ET - NGP - WL - BZA - MAS)
        {
            number: '12616',
            name: 'Grand Trunk Express (NDLS - MAS)',
            type: 'Superfast',
            total_seats: 1900,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '16:10:00', dist: 0, plat: 4 },
                { code: 'AGC', arr: '18:48:00', dep: '18:53:00', dist: 195, plat: 1 },
                { code: 'GWL', arr: '20:43:00', dep: '20:45:00', dist: 313, plat: 1 },
                { code: 'JHS', arr: '22:05:00', dep: '22:15:00', dist: 410, plat: 1 },
                { code: 'BPL', arr: '02:00:00', dep: '02:05:00', dist: 702, plat: 1 },
                { code: 'ET', arr: '03:45:00', dep: '03:55:00', dist: 794, plat: 2 },
                { code: 'NGP', arr: '09:20:00', dep: '09:25:00', dist: 1092, plat: 2 },
                { code: 'WL', arr: '17:40:00', dep: '17:45:00', dist: 1542, plat: 1 },
                { code: 'VZA', arr: '21:40:00', dep: '21:50:00', dist: 1750, plat: 6 },
                { code: 'MAS', arr: '04:30:00', dep: null, dist: 2182, plat: 8 }
            ]
        },
        // 5. Kerala Express (NDLS - AGC - GWL - BPL - NGP - VZA - RU - TVC)
        {
            number: '12626',
            name: 'Kerala Express (NDLS - TVC)',
            type: 'Superfast',
            total_seats: 1950,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 540, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '20:10:00', dist: 0, plat: 3 },
                { code: 'AGC', arr: '22:20:00', dep: '22:25:00', dist: 195, plat: 1 },
                { code: 'GWL', arr: '23:43:00', dep: '23:45:00', dist: 313, plat: 2 },
                { code: 'BPL', arr: '05:20:00', dep: '05:25:00', dist: 702, plat: 1 },
                { code: 'NGP', arr: '11:45:00', dep: '11:50:00', dist: 1092, plat: 2 },
                { code: 'VZA', arr: '22:10:00', dep: '22:20:00', dist: 1750, plat: 4 },
                { code: 'RU', arr: '04:15:00', dep: '04:20:00', dist: 2130, plat: 2 },
                { code: 'CBE', arr: '12:20:00', dep: '12:25:00', dist: 2600, plat: 1 },
                { code: 'ERS', arr: '16:50:00', dep: '16:55:00', dist: 2840, plat: 1 },
                { code: 'TVC', arr: '21:55:00', dep: null, dist: 3036, plat: 3 }
            ]
        },
        // 6. Paschim Express (BDTS - ST - BRC - RTM - KOTA - MTJ - NDLS - CDG - ASR)
        {
            number: '12925',
            name: 'Paschim Express (Mumbai - Amritsar)',
            type: 'Superfast',
            total_seats: 1850,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 18, fare_per_km: 4.6 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'BCT', arr: null, dep: '11:25:00', dist: 0, plat: 2 },
                { code: 'ST', arr: '15:47:00', dep: '15:52:00', dist: 263, plat: 1 },
                { code: 'BRC', arr: '17:37:00', dep: '17:47:00', dist: 392, plat: 3 },
                { code: 'RTM', arr: '21:40:00', dep: '21:45:00', dist: 653, plat: 2 },
                { code: 'KOTA', arr: '01:50:00', dep: '01:55:00', dist: 920, plat: 1 },
                { code: 'MTJ', arr: '07:30:00', dep: '07:35:00', dist: 1245, plat: 2 },
                { code: 'NDLS', arr: '10:40:00', dep: '11:05:00', dist: 1384, plat: 4 },
                { code: 'CDG', arr: '15:35:00', dep: '15:45:00', dist: 1640, plat: 1 },
                { code: 'LDH', arr: '17:35:00', dep: '17:45:00', dist: 1755, plat: 2 },
                { code: 'ASR', arr: '20:10:00', dep: null, dist: 1890, plat: 3 }
            ]
        },
        // 7. Gitanjali Express (CSMT - TNA - KYN - NK - BSL - NGP - R - BSP - ROU - TATA - KGP - HWH)
        {
            number: '12859',
            name: 'Gitanjali Express (Mumbai - Howrah)',
            type: 'Superfast',
            total_seats: 1800,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'BCT', arr: null, dep: '06:00:00', dist: 0, plat: 18 },
                { code: 'KYN', arr: '06:52:00', dep: '06:55:00', dist: 54, plat: 4 },
                { code: 'NK', arr: '09:25:00', dep: '09:30:00', dist: 187, plat: 2 },
                { code: 'BSL', arr: '13:00:00', dep: '13:05:00', dist: 444, plat: 3 },
                { code: 'NGP', arr: '18:55:00', dep: '19:00:00', dist: 837, plat: 6 },
                { code: 'R', arr: '23:30:00', dep: '23:35:00', dist: 1140, plat: 1 },
                { code: 'BSP', arr: '01:20:00', dep: '01:35:00', dist: 1250, plat: 1 },
                { code: 'ROU', arr: '06:00:00', dep: '06:10:00', dist: 1555, plat: 3 },
                { code: 'TATA', arr: '08:45:00', dep: '08:55:00', dist: 1756, plat: 4 },
                { code: 'KGP', arr: '10:45:00', dep: '10:50:00', dist: 1890, plat: 6 },
                { code: 'HWH', arr: '12:30:00', dep: null, dist: 2005, plat: 21 }
            ]
        },
        // 8. Karnataka Express (SBC - DVG - UBL - BGM - PUNE - CSMT) - Deccan Intercity
        {
            number: '11006',
            name: 'Chalukya Express (SBC - CSMT)',
            type: 'Express',
            total_seats: 1700,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 46, fare_per_km: 2.8 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.8 },
                { code: 'SL', name: 'Sleeper Class', seats: 480, fare_per_km: 0.42 }
            ],
            stops: [
                { code: 'SBC', arr: null, dep: '06:30:00', dist: 0, plat: 8 },
                { code: 'DVG', arr: '11:10:00', dep: '11:12:00', dist: 325, plat: 1 },
                { code: 'UBL', arr: '14:00:00', dep: '14:10:00', dist: 470, plat: 1 },
                { code: 'BGM', arr: '16:50:00', dep: '16:55:00', dist: 612, plat: 2 },
                { code: 'PNQ', arr: '01:50:00', dep: '02:00:00', dist: 1040, plat: 3 },
                { code: 'BCT', arr: '05:45:00', dep: null, dist: 1230, plat: 1 }
            ]
        },
        // 9. Konkan Kanya Express (CSMT - TNA - PNVL - MAO - MAQ)
        {
            number: '10111',
            name: 'Konkan Kanya Express (Mumbai - Madgaon - Mangalore)',
            type: 'Superfast',
            total_seats: 1750,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 18, fare_per_km: 4.5 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'BCT', arr: null, dep: '23:05:00', dist: 0, plat: 15 },
                { code: 'TNA', arr: '23:47:00', dep: '23:50:00', dist: 33, plat: 7 },
                { code: 'PNVL', arr: '00:30:00', dep: '00:35:00', dist: 68, plat: 5 },
                { code: 'MAO', arr: '10:45:00', dep: '11:00:00', dist: 570, plat: 2 },
                { code: 'MAQ', arr: '17:20:00', dep: null, dist: 885, plat: 1 }
            ]
        },
        // 10. Guwahati Express (SBC - MAS - VZA - VSKP - BBS - HWH - MLDT - NJP - GHY)
        {
            number: '12509',
            name: 'Kaziranga Express (Bengaluru - Guwahati)',
            type: 'Superfast',
            total_seats: 1850,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'SBC', arr: null, dep: '23:40:00', dist: 0, plat: 1 },
                { code: 'MAS', arr: '05:30:00', dep: '05:55:00', dist: 357, plat: 5 },
                { code: 'VZA', arr: '11:40:00', dep: '11:50:00', dist: 788, plat: 7 },
                { code: 'VSKP', arr: '18:10:00', dep: '18:30:00', dist: 1138, plat: 1 },
                { code: 'BBS', arr: '01:50:00', dep: '01:55:00', dist: 1581, plat: 3 },
                { code: 'HWH', arr: '08:20:00', dep: '08:45:00', dist: 2020, plat: 12 },
                { code: 'NJP', arr: '17:40:00', dep: '17:50:00', dist: 2580, plat: 2 },
                { code: 'GHY', arr: '04:30:00', dep: null, dist: 2990, plat: 1 }
            ]
        },
        // 11. Sanghamitra Express (SBC - MAS - VZA - NGP - JBP - PRYJ - DNR - PNBE)
        {
            number: '12295',
            name: 'Sanghamitra Superfast Express (SBC - Patna)',
            type: 'Superfast',
            total_seats: 1900,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 540, fare_per_km: 0.43 }
            ],
            stops: [
                { code: 'SBC', arr: null, dep: '09:15:00', dist: 0, plat: 4 },
                { code: 'MAS', arr: '15:10:00', dep: '15:35:00', dist: 357, plat: 7 },
                { code: 'VZA', arr: '21:30:00', dep: '21:40:00', dist: 788, plat: 1 },
                { code: 'NGP', arr: '08:40:00', dep: '08:45:00', dist: 1445, plat: 1 },
                { code: 'JBP', arr: '15:20:00', dep: '15:30:00', dist: 1990, plat: 2 },
                { code: 'PRYJ', arr: '22:50:00', dep: '23:15:00', dist: 2360, plat: 4 },
                { code: 'DNR', arr: '07:10:00', dep: '07:15:00', dist: 2680, plat: 1 },
                { code: 'PNBE', arr: '07:40:00', dep: null, dist: 2690, plat: 1 }
            ]
        },
        // 12. Vande Bharat Express (Chennai - Bengaluru - Mysuru)
        {
            number: '20607',
            name: 'Vande Bharat Express (Chennai - Mysuru)',
            type: 'Superfast',
            total_seats: 1128,
            classes: [
                { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.5 },
                { code: 'CC', name: 'AC Chair Car', seats: 320, fare_per_km: 2.2 }
            ],
            stops: [
                { code: 'MAS', arr: null, dep: '05:50:00', dist: 0, plat: 2 },
                { code: 'SBC', arr: '10:15:00', dep: '10:20:00', dist: 357, plat: 7 },
                { code: 'MYS', arr: '12:20:00', dep: null, dist: 496, plat: 1 }
            ]
        },
        // 13. Vande Bharat Express (Mysuru - Bengaluru - Chennai)
        {
            number: '20608',
            name: 'Vande Bharat Express (Mysuru - Chennai)',
            type: 'Superfast',
            total_seats: 1128,
            classes: [
                { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.5 },
                { code: 'CC', name: 'AC Chair Car', seats: 320, fare_per_km: 2.2 }
            ],
            stops: [
                { code: 'MYS', arr: null, dep: '13:05:00', dist: 0, plat: 1 },
                { code: 'SBC', arr: '14:50:00', dep: '14:55:00', dist: 139, plat: 7 },
                { code: 'MAS', arr: '19:20:00', dep: null, dist: 496, plat: 2 }
            ]
        },
        // 14. Rajasthan Sampark Kranti (JU - JP - NDLS)
        {
            number: '12464',
            name: 'Rajasthan Sampark Kranti Express',
            type: 'Superfast',
            total_seats: 1700,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 18, fare_per_km: 4.6 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 480, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'JU', arr: null, dep: '19:45:00', dist: 0, plat: 1 },
                { code: 'JP', arr: '00:30:00', dep: '00:40:00', dist: 312, plat: 3 },
                { code: 'NDLS', arr: '05:40:00', dep: null, dist: 620, plat: 6 }
            ]
        },
        // 15. Chetak Express (UDZ - AII - JP - DEC - DLI)
        {
            number: '20474',
            name: 'Chetak Superfast Express (Udaipur - Delhi)',
            type: 'Superfast',
            total_seats: 1700,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 480, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'UDZ', arr: null, dep: '17:00:00', dist: 0, plat: 1 },
                { code: 'AII', arr: '22:15:00', dep: '22:25:00', dist: 300, plat: 2 },
                { code: 'JP', arr: '00:15:00', dep: '00:25:00', dist: 435, plat: 1 },
                { code: 'DEC', arr: '04:45:00', dep: '04:47:00', dist: 720, plat: 1 },
                { code: 'DLI', arr: '05:35:00', dep: null, dist: 735, plat: 4 }
            ]
        }
    ];

    for (const t of trainsData) {
        // Insert or update train
        await db.query(`
            INSERT INTO trains (train_number, train_name, train_type, total_seats, status)
            VALUES (?, ?, ?, ?, 'Active')
            ON DUPLICATE KEY UPDATE train_name = VALUES(train_name), train_type = VALUES(train_type), total_seats = VALUES(total_seats), status = 'Active'
        `, [t.number, t.name, t.type, t.total_seats]);

        const [[tRow]] = await db.query('SELECT train_id FROM trains WHERE train_number = ?', [t.number]);
        const trainId = tRow.train_id;

        // Classes
        for (const c of t.classes) {
            await db.query(`
                INSERT INTO train_classes (train_id, class_code, class_name, total_seats, fare_per_km)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE total_seats = VALUES(total_seats), fare_per_km = VALUES(fare_per_km)
            `, [trainId, c.code, c.name, c.seats, c.fare_per_km]);
        }

        // Reset routes
        await db.query('DELETE FROM routes WHERE train_id = ?', [trainId]);

        // Insert stops
        let seq = 1;
        for (const s of t.stops) {
            const sid = smap[s.code];
            if (!sid) {
                console.warn(`Station code ${s.code} missing!`);
                continue;
            }
            await db.query(`
                INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [trainId, sid, seq, s.arr, s.dep, s.dist, s.plat || 1]);
            seq++;
        }

        // Daily schedule
        await db.query(`
            INSERT INTO train_schedule (train_id, runs_on_mon, runs_on_tue, runs_on_wed, runs_on_thu, runs_on_fri, runs_on_sat, runs_on_sun)
            VALUES (?, 1, 1, 1, 1, 1, 1, 1)
            ON DUPLICATE KEY UPDATE runs_on_mon=1, runs_on_tue=1, runs_on_wed=1, runs_on_thu=1, runs_on_fri=1, runs_on_sat=1, runs_on_sun=1
        `, [trainId]);
    }

    const [totalTrains] = await db.query('SELECT COUNT(*) as cnt FROM trains');
    const [totalRoutes] = await db.query('SELECT COUNT(*) as cnt FROM routes');
    console.log(`✅ Success! Now database has ${totalTrains[0].cnt} Active Trains and ${totalRoutes[0].cnt} Inter-City Route Stops.`);
    process.exit(0);
}

seedMassiveTrains().catch(err => {
    console.error('Error seeding trains:', err);
    process.exit(1);
});
