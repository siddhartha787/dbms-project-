// ============================================================
// Database Populator: All Indian Stations, Trains, Classes, Routes & Schedules
// ============================================================

const db = require('./db');

async function populateAll() {
    console.log('🚀 Starting Comprehensive Train & Station Population...');

    // 1. STATIONS
    const stationsList = [
        { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi', zone: 'Northern' },
        { code: 'BCT', name: 'Mumbai Central Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'Western' },
        { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'Southern' },
        { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'Eastern' },
        { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', zone: 'South Western' },
        { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'Western' },
        { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'North Western' },
        { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'Northern' },
        { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'South Central' },
        { code: 'PNQ', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'Central' },
        { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'North Central' },
        { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'North Central' },
        { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'Northeast Frontier' },
        { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'West Central' },
        { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'Central' },
        { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'South Central' },
        { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'North Western' },
        { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'North Western' },
        { code: 'PTK', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'East Central' },
        { code: 'VZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'South Central' },
        { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'Northern' },
        { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'North Central' },
        { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'North Eastern' },
        { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'Northern' },
        { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', zone: 'Northern' },
        { code: 'HW', name: 'Haridwar Junction', city: 'Haridwar', state: 'Uttarakhand', zone: 'Northern' },
        { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', zone: 'Northern' },
        { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir', zone: 'Northern' },
        { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir', zone: 'Northern' },
        { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'Western' },
        { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'Western' },
        { code: 'RTM', name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh', zone: 'Western' },
        { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', zone: 'West Central' },
        { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'North Central' },
        { code: 'JHS', name: 'Virangana Lakshmibai Jhansi', city: 'Jhansi', state: 'Uttar Pradesh', zone: 'North Central' },
        { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'East Coast' },
        { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', zone: 'East Coast' },
        { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'South East Central' },
        { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', zone: 'South East Central' },
        { code: 'MGS', name: 'Pt. Deen Dayal Upadhyaya Junction', city: 'Mughalsarai', state: 'Uttar Pradesh', zone: 'East Central' },
        { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'East Central' },
        { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand', zone: 'East Central' },
        { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', zone: 'South Eastern' },
        { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand', zone: 'South Eastern' },
        { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'Southern' },
        { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala', zone: 'Southern' },
        { code: 'CLT', name: 'Kozhikode Main', city: 'Kozhikode', state: 'Kerala', zone: 'Southern' },
        { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'Southern' },
        { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'Southern' },
        { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'East Coast' },
        { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', zone: 'South Western' },
        { code: 'GOA', name: 'Madgaon Junction', city: 'Madgaon', state: 'Goa', zone: 'Konkan' }
    ];

    for (const s of stationsList) {
        await db.query(`
            INSERT INTO stations (station_code, station_name, city, state, zone)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE station_name = VALUES(station_name), city = VALUES(city)
        `, [s.code, s.name, s.city, s.state, s.zone]);
    }
    console.log(`✅ Loaded ${stationsList.length} Railway Stations`);

    // Fetch station map (code -> station_id)
    const [stationRows] = await db.query('SELECT station_id, station_code FROM stations');
    const stationMap = {};
    stationRows.forEach(r => stationMap[r.station_code] = r.station_id);

    // 2. TRAINS WITH RICH MULTI-STOP ROUTES
    const trainDefinitions = [
        // Agra to Ahmedabad & Mumbai Corridor (Includes AGC -> KOTA -> RTM -> BRC -> ADI)
        {
            number: '12948',
            name: 'Azimabad Express (AGC - ADI - BCT)',
            type: 'Superfast',
            total_seats: 1600,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 128, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 400, fare_per_km: 0.45 }
            ],
            stops: [
                { code: 'AGC', arr: null, dep: '02:15:00', dist: 0, plat: 1 },
                { code: 'KOTA', arr: '06:45:00', dep: '06:55:00', dist: 334, plat: 2 },
                { code: 'RTM', arr: '10:30:00', dep: '10:40:00', dist: 600, plat: 3 },
                { code: 'BRC', arr: '14:20:00', dep: '14:30:00', dist: 861, plat: 4 },
                { code: 'ADI', arr: '16:45:00', dep: '17:05:00', dist: 960, plat: 1 },
                { code: 'ST', arr: '20:10:00', dep: '20:15:00', dist: 1190, plat: 3 },
                { code: 'BCT', arr: '23:45:00', dep: null, dist: 1450, plat: 2 }
            ]
        },
        // Ahmedabad to Agra Express (Reverse)
        {
            number: '12947',
            name: 'Azimabad Express (ADI - AGC)',
            type: 'Superfast',
            total_seats: 1600,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 128, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 400, fare_per_km: 0.45 }
            ],
            stops: [
                { code: 'ADI', arr: null, dep: '21:50:00', dist: 0, plat: 3 },
                { code: 'BRC', arr: '23:05:00', dep: '23:15:00', dist: 99, plat: 2 },
                { code: 'RTM', arr: '03:15:00', dep: '03:25:00', dist: 360, plat: 1 },
                { code: 'KOTA', arr: '06:50:00', dep: '07:00:00', dist: 626, plat: 2 },
                { code: 'AGC', arr: '12:20:00', dep: null, dist: 960, plat: 1 }
            ]
        },
        // Haridwar - Agra - Ahmedabad Express
        {
            number: '19032',
            name: 'Yoga Express (HW - AGC - ADI)',
            type: 'Express',
            total_seats: 1800,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 46, fare_per_km: 2.8 },
                { code: '3A', name: 'AC Three Tier', seats: 120, fare_per_km: 1.85 },
                { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.42 }
            ],
            stops: [
                { code: 'HW', arr: null, dep: '15:55:00', dist: 0, plat: 1 },
                { code: 'NDLS', arr: '21:15:00', dep: '21:30:00', dist: 253, plat: 4 },
                { code: 'AGC', arr: '01:05:00', dep: '01:10:00', dist: 450, plat: 2 },
                { code: 'JP', arr: '05:40:00', dep: '05:50:00', dist: 690, plat: 1 },
                { code: 'ADI', arr: '15:35:00', dep: null, dist: 1315, plat: 2 }
            ]
        },
        // Delhi - Agra - Bhopal Shatabdi
        {
            number: '12002',
            name: 'Bhopal Shatabdi Express',
            type: 'Shatabdi',
            total_seats: 1150,
            classes: [
                { code: 'EC', name: 'Executive Chair Car', seats: 56, fare_per_km: 3.1 },
                { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 1.85 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '06:00:00', dist: 0, plat: 1 },
                { code: 'AGC', arr: '07:50:00', dep: '07:55:00', dist: 195, plat: 1 },
                { code: 'GWL', arr: '09:23:00', dep: '09:28:00', dist: 313, plat: 2 },
                { code: 'JHS', arr: '10:45:00', dep: '10:50:00', dist: 410, plat: 2 },
                { code: 'BPL', arr: '14:40:00', dep: null, dist: 705, plat: 1 }
            ]
        },
        // Vande Bharat Express (NDLS - CNB - PRYJ - BSB)
        {
            number: '22436',
            name: 'Vande Bharat Express (NDLS-BSB)',
            type: 'Superfast',
            total_seats: 1128,
            classes: [
                { code: 'EC', name: 'Executive Class', seats: 52, fare_per_km: 3.4 },
                { code: 'CC', name: 'AC Chair Car', seats: 320, fare_per_km: 2.1 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '06:00:00', dist: 0, plat: 16 },
                { code: 'CNB', arr: '10:08:00', dep: '10:10:00', dist: 440, plat: 1 },
                { code: 'PRYJ', arr: '12:08:00', dep: '12:10:00', dist: 635, plat: 4 },
                { code: 'BSB', arr: '14:00:00', dep: null, dist: 759, plat: 1 }
            ]
        },
        // Mumbai - Ahmedabad Vande Bharat
        {
            number: '20901',
            name: 'Vande Bharat (Mumbai - Ahmedabad)',
            type: 'Superfast',
            total_seats: 1128,
            classes: [
                { code: 'EC', name: 'Executive Class', seats: 52, fare_per_km: 3.5 },
                { code: 'CC', name: 'AC Chair Car', seats: 320, fare_per_km: 2.2 }
            ],
            stops: [
                { code: 'BCT', arr: null, dep: '06:10:00', dist: 0, plat: 5 },
                { code: 'ST', arr: '08:50:00', dep: '08:53:00', dist: 263, plat: 1 },
                { code: 'BRC', arr: '10:15:00', dep: '10:18:00', dist: 392, plat: 2 },
                { code: 'ADI', arr: '11:25:00', dep: null, dist: 491, plat: 1 }
            ]
        },
        // Ashram Express (NDLS - JP - ADI)
        {
            number: '12916',
            name: 'Ashram Express (NDLS - ADI)',
            type: 'Superfast',
            total_seats: 1650,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 128, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 400, fare_per_km: 0.45 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '15:20:00', dist: 0, plat: 3 },
                { code: 'JP', arr: '20:15:00', dep: '20:25:00', dist: 308, plat: 2 },
                { code: 'UDZ', arr: '02:40:00', dep: '02:50:00', dist: 715, plat: 1 },
                { code: 'ADI', arr: '07:40:00', dep: null, dist: 934, plat: 4 }
            ]
        },
        // Telangana Superfast Express (NDLS - AGC - GWL - BPL - NGP - SC - HYB)
        {
            number: '12724',
            name: 'Telangana Express (NDLS - HYB)',
            type: 'Superfast',
            total_seats: 1800,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.95 },
                { code: '3A', name: 'AC Three Tier', seats: 130, fare_per_km: 1.95 },
                { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '16:00:00', dist: 0, plat: 7 },
                { code: 'AGC', arr: '18:15:00', dep: '18:20:00', dist: 195, plat: 1 },
                { code: 'GWL', arr: '20:00:00', dep: '20:05:00', dist: 313, plat: 2 },
                { code: 'BPL', arr: '01:20:00', dep: '01:30:00', dist: 705, plat: 1 },
                { code: 'NGP', arr: '07:10:00', dep: '07:20:00', dist: 1095, plat: 2 },
                { code: 'SC', arr: '15:55:00', dep: '16:05:00', dist: 1670, plat: 3 },
                { code: 'HYB', arr: '17:10:00', dep: null, dist: 1679, plat: 5 }
            ]
        },
        // Karnataka Express (NDLS - AGC - JHS - BPL - NGP - SBC)
        {
            number: '12628',
            name: 'Karnataka Express (NDLS - SBC)',
            type: 'Superfast',
            total_seats: 1850,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.9 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 3.0 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.95 },
                { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.45 }
            ],
            stops: [
                { code: 'NDLS', arr: null, dep: '20:20:00', dist: 0, plat: 3 },
                { code: 'AGC', arr: '22:48:00', dep: '22:50:00', dist: 195, plat: 1 },
                { code: 'JHS', arr: '02:05:00', dep: '02:15:00', dist: 410, plat: 1 },
                { code: 'BPL', arr: '06:20:00', dep: '06:30:00', dist: 705, plat: 1 },
                { code: 'NGP', arr: '12:40:00', dep: '12:50:00', dist: 1095, plat: 2 },
                { code: 'SBC', arr: '12:00:00', dep: null, dist: 2410, plat: 1 }
            ]
        },
        // Howrah - Mumbai Superfast Mail (HWH - TATA - R - NGP - BCT)
        {
            number: '12810',
            name: 'Howrah Mumbai Mail (HWH - BCT)',
            type: 'Superfast',
            total_seats: 1750,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 18, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 46, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 128, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 400, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'HWH', arr: null, dep: '19:35:00', dist: 0, plat: 18 },
                { code: 'TATA', arr: '23:35:00', dep: '23:45:00', dist: 250, plat: 3 },
                { code: 'R', arr: '08:50:00', dep: '09:00:00', dist: 830, plat: 1 },
                { code: 'NGP', arr: '13:55:00', dep: '14:05:00', dist: 1130, plat: 3 },
                { code: 'PNQ', arr: '01:50:00', dep: '02:00:00', dist: 1820, plat: 2 },
                { code: 'BCT', arr: '05:25:00', dep: null, dist: 1968, plat: 3 }
            ]
        },
        // Coromandel Express (HWH - BBS - VSKP - VZA - MAS)
        {
            number: '12841',
            name: 'Coromandel Express (HWH - MAS)',
            type: 'Superfast',
            total_seats: 1800,
            classes: [
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 140, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.44 }
            ],
            stops: [
                { code: 'HWH', arr: null, dep: '15:20:00', dist: 0, plat: 8 },
                { code: 'BBS', arr: '21:50:00', dep: '21:55:00', dist: 437, plat: 4 },
                { code: 'VSKP', arr: '04:25:00', dep: '04:45:00', dist: 880, plat: 1 },
                { code: 'VZA', arr: '10:00:00', dep: '10:10:00', dist: 1230, plat: 1 },
                { code: 'MAS', arr: '16:50:00', dep: null, dist: 1662, plat: 2 }
            ]
        },
        // Golden Temple Mail (ASR - NDLS - AGC - KOTA - BRC - BCT)
        {
            number: '12904',
            name: 'Golden Temple Mail (ASR - BCT)',
            type: 'Superfast',
            total_seats: 1750,
            classes: [
                { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.9 },
                { code: '3A', name: 'AC Three Tier', seats: 128, fare_per_km: 1.9 },
                { code: 'SL', name: 'Sleeper Class', seats: 420, fare_per_km: 0.45 }
            ],
            stops: [
                { code: 'ASR', arr: null, dep: '18:55:00', dist: 0, plat: 1 },
                { code: 'NDLS', arr: '03:45:00', dep: '04:00:00', dist: 448, plat: 2 },
                { code: 'AGC', arr: '06:50:00', dep: '06:55:00', dist: 643, plat: 1 },
                { code: 'KOTA', arr: '11:20:00', dep: '11:30:00', dist: 977, plat: 2 },
                { code: 'RTM', arr: '15:10:00', dep: '15:20:00', dist: 1243, plat: 1 },
                { code: 'BRC', arr: '19:05:00', dep: '19:15:00', dist: 1504, plat: 3 },
                { code: 'ST', arr: '21:10:00', dep: '21:15:00', dist: 1634, plat: 2 },
                { code: 'BCT', arr: '23:35:00', dep: null, dist: 1897, plat: 1 }
            ]
        }
    ];

    for (const t of trainDefinitions) {
        // Insert or update train
        await db.query(`
            INSERT INTO trains (train_number, train_name, train_type, total_seats, status)
            VALUES (?, ?, ?, ?, 'Active')
            ON DUPLICATE KEY UPDATE train_name = VALUES(train_name), train_type = VALUES(train_type), total_seats = VALUES(total_seats), status = 'Active'
        `, [t.number, t.name, t.type, t.total_seats]);

        const [[trainRow]] = await db.query('SELECT train_id FROM trains WHERE train_number = ?', [t.number]);
        const trainId = trainRow.train_id;

        // Classes
        for (const c of t.classes) {
            await db.query(`
                INSERT INTO train_classes (train_id, class_code, class_name, total_seats, fare_per_km)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE total_seats = VALUES(total_seats), fare_per_km = VALUES(fare_per_km)
            `, [trainId, c.code, c.name, c.seats, c.fare_per_km]);
        }

        // Clean existing routes for this train
        await db.query('DELETE FROM routes WHERE train_id = ?', [trainId]);

        // Insert route sequence
        let seq = 1;
        for (const st of t.stops) {
            const stId = stationMap[st.code];
            if (!stId) {
                console.warn(`⚠️ Warning: Station code ${st.code} not found!`);
                continue;
            }
            await db.query(`
                INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [trainId, stId, seq, st.arr, st.dep, st.dist, st.plat]);
            seq++;
        }

        // Schedule (daily runs)
        await db.query(`
            INSERT INTO train_schedule (train_id, runs_on_mon, runs_on_tue, runs_on_wed, runs_on_thu, runs_on_fri, runs_on_sat, runs_on_sun)
            VALUES (?, 1, 1, 1, 1, 1, 1, 1)
            ON DUPLICATE KEY UPDATE runs_on_mon=1, runs_on_tue=1, runs_on_wed=1, runs_on_thu=1, runs_on_fri=1, runs_on_sat=1, runs_on_sun=1
        `, [trainId]);
    }

    console.log(`✅ Loaded ${trainDefinitions.length} Comprehensive Express & Superfast Trains with Full Multi-Stop Inter-City Networks!`);
    process.exit(0);
}

populateAll().catch(err => {
    console.error('❌ Population Error:', err);
    process.exit(1);
});
