// =======================================================================
// Comprehensive Pan-India Train Network Seeder
// Seeds 120+ Major Trains with Multi-Station Route Stops Across All 18 Zones
// Including Vande Bharat, Rajdhani, Shatabdi, Duronto, Superfast, Mail & Express
// =======================================================================

const db = require('./db');

async function seedAllIndianTrains() {
    console.log('🚀 Seeding comprehensive All-India Trains Network...');

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Load Station Code to ID Map
        const [stations] = await connection.query('SELECT station_id, station_code FROM stations');
        const smap = {};
        stations.forEach(s => smap[s.station_code] = s.station_id);

        // Helper to check valid stations
        function getStops(stopList) {
            return stopList.filter(st => {
                if (!smap[st.code]) {
                    console.warn(`Station code ${st.code} not found, skipping stop.`);
                    return false;
                }
                return true;
            });
        }

        const trains = [
            // ============================================================
            // 1. PREMIER VANDE BHARAT EXPRESSES (High Speed Modern Fleet)
            // ============================================================
            {
                number: '22436',
                name: 'New Delhi - Varanasi Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Anubhuti Chair Car', seats: 52, fare_per_km: 3.8 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.1 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '06:00:00', dist: 0, plat: 1 },
                    { code: 'CNB', arr: '10:08:00', dep: '10:10:00', dist: 440, plat: 1 },
                    { code: 'PRYJ', arr: '12:08:00', dep: '12:10:00', dist: 635, plat: 6 },
                    { code: 'BSB', arr: '14:00:00', dep: null, dist: 759, plat: 1 }
                ]
            },
            {
                number: '22435',
                name: 'Varanasi - New Delhi Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Anubhuti Chair Car', seats: 52, fare_per_km: 3.8 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.1 }
                ],
                stops: [
                    { code: 'BSB', arr: null, dep: '15:00:00', dist: 0, plat: 1 },
                    { code: 'PRYJ', arr: '16:30:00', dep: '16:32:00', dist: 124, plat: 6 },
                    { code: 'CNB', arr: '18:30:00', dep: '18:32:00', dist: 319, plat: 1 },
                    { code: 'NDLS', arr: '23:00:00', dep: null, dist: 759, plat: 1 }
                ]
            },
            {
                number: '22439',
                name: 'New Delhi - Katra Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '06:00:00', dist: 0, plat: 2 },
                    { code: 'UMB', arr: '08:10:00', dep: '08:12:00', dist: 198, plat: 7 },
                    { code: 'LDH', arr: '09:19:00', dep: '09:21:00', dist: 312, plat: 2 },
                    { code: 'JAT', arr: '12:38:00', dep: '12:40:00', dist: 577, plat: 1 },
                    { code: 'SVDK', arr: '14:00:00', dep: null, dist: 655, plat: 1 }
                ]
            },
            {
                number: '22440',
                name: 'Shri Mata Vaishno Devi Katra - New Delhi Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'SVDK', arr: null, dep: '15:00:00', dist: 0, plat: 1 },
                    { code: 'JAT', arr: '16:13:00', dep: '16:15:00', dist: 78, plat: 1 },
                    { code: 'LDH', arr: '19:32:00', dep: '19:34:00', dist: 343, plat: 1 },
                    { code: 'UMB', arr: '20:41:00', dep: '20:43:00', dist: 457, plat: 6 },
                    { code: 'NDLS', arr: '23:00:00', dep: null, dist: 655, plat: 2 }
                ]
            },
            {
                number: '20901',
                name: 'Mumbai Central - Gandhinagar Capital Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'BCT', arr: null, dep: '06:00:00', dist: 0, plat: 5 },
                    { code: 'ST', arr: '08:37:00', dep: '08:40:00', dist: 263, plat: 1 },
                    { code: 'BRC', arr: '09:56:00', dep: '09:59:00', dist: 392, plat: 2 },
                    { code: 'ANND', arr: '10:25:00', dep: '10:27:00', dist: 428, plat: 3 },
                    { code: 'ADI', arr: '11:25:00', dep: '11:30:00', dist: 491, plat: 9 }
                ]
            },
            {
                number: '20902',
                name: 'Gandhinagar Capital - Mumbai Central Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'ADI', arr: null, dep: '14:45:00', dist: 0, plat: 9 },
                    { code: 'ANND', arr: '15:28:00', dep: '15:30:00', dist: 63, plat: 4 },
                    { code: 'BRC', arr: '16:00:00', dep: '16:03:00', dist: 99, plat: 1 },
                    { code: 'ST', arr: '17:20:00', dep: '17:23:00', dist: 228, plat: 2 },
                    { code: 'BCT', arr: '20:25:00', dep: null, dist: 491, plat: 5 }
                ]
            },
            {
                number: '20607',
                name: 'MGR Chennai Central - Mysuru Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '05:50:00', dist: 0, plat: 2 },
                    { code: 'SBC', arr: '10:15:00', dep: '10:20:00', dist: 358, plat: 7 },
                    { code: 'MYS', arr: '12:20:00', dep: null, dist: 497, plat: 1 }
                ]
            },
            {
                number: '20608',
                name: 'Mysuru - MGR Chennai Central Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'MYS', arr: null, dep: '13:05:00', dist: 0, plat: 1 },
                    { code: 'SBC', arr: '14:50:00', dep: '14:55:00', dist: 139, plat: 7 },
                    { code: 'MAS', arr: '19:20:00', dep: null, dist: 497, plat: 2 }
                ]
            },
            {
                number: '22895',
                name: 'Howrah - Puri Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '06:10:00', dist: 0, plat: 21 },
                    { code: 'KGP', arr: '07:38:00', dep: '07:40:00', dist: 115, plat: 3 },
                    { code: 'CTC', arr: '10:32:00', dep: '10:34:00', dist: 409, plat: 3 },
                    { code: 'BBS', arr: '11:06:00', dep: '11:08:00', dist: 437, plat: 2 },
                    { code: 'PURI', arr: '12:35:00', dep: null, dist: 500, plat: 7 }
                ]
            },
            {
                number: '22896',
                name: 'Puri - Howrah Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'PURI', arr: null, dep: '13:50:00', dist: 0, plat: 7 },
                    { code: 'BBS', arr: '14:55:00', dep: '14:57:00', dist: 63, plat: 1 },
                    { code: 'CTC', arr: '15:20:00', dep: '15:22:00', dist: 91, plat: 1 },
                    { code: 'KGP', arr: '18:18:00', dep: '18:20:00', dist: 385, plat: 1 },
                    { code: 'HWH', arr: '20:30:00', dep: null, dist: 500, plat: 21 }
                ]
            },
            {
                number: '20171',
                name: 'Rani Kamalapati (Bhopal) - Hazrat Nizamuddin Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'RKMP', arr: null, dep: '05:40:00', dist: 0, plat: 1 },
                    { code: 'BPL', arr: '05:50:00', dep: '05:55:00', dist: 6, plat: 2 },
                    { code: 'JHS', arr: '08:46:00', dep: '08:48:00', dist: 298, plat: 4 },
                    { code: 'GWL', arr: '09:48:00', dep: '09:50:00', dist: 396, plat: 2 },
                    { code: 'AGC', arr: '11:23:00', dep: '11:25:00', dist: 514, plat: 2 },
                    { code: 'NZM', arr: '13:10:00', dep: null, dist: 702, plat: 5 }
                ]
            },
            {
                number: '20172',
                name: 'Hazrat Nizamuddin - Rani Kamalapati Vande Bharat',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'NZM', arr: null, dep: '14:40:00', dist: 0, plat: 5 },
                    { code: 'AGC', arr: '16:20:00', dep: '16:22:00', dist: 188, plat: 1 },
                    { code: 'GWL', arr: '17:48:00', dep: '17:50:00', dist: 306, plat: 1 },
                    { code: 'JHS', arr: '19:00:00', dep: '19:05:00', dist: 404, plat: 1 },
                    { code: 'BPL', arr: '21:55:00', dep: '22:00:00', dist: 696, plat: 1 },
                    { code: 'RKMP', arr: '22:15:00', dep: null, dist: 702, plat: 1 }
                ]
            },
            {
                number: '20977',
                name: 'Ajmer - Delhi Cantt Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'AII', arr: null, dep: '06:20:00', dist: 0, plat: 6 },
                    { code: 'JP', arr: '08:00:00', dep: '08:05:00', dist: 135, plat: 1 },
                    { code: 'DEC', arr: '11:35:00', dep: null, dist: 429, plat: 3 }
                ]
            },
            {
                number: '20978',
                name: 'Delhi Cantt - Ajmer Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'DEC', arr: null, dep: '18:40:00', dist: 0, plat: 3 },
                    { code: 'JP', arr: '22:05:00', dep: '22:10:00', dist: 294, plat: 1 },
                    { code: 'AII', arr: '23:55:00', dep: null, dist: 429, plat: 6 }
                ]
            },
            {
                number: '22348',
                name: 'Patna - Howrah Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'PNBE', arr: null, dep: '08:00:00', dist: 0, plat: 1 },
                    { code: 'ASN', arr: '11:44:00', dep: '11:46:00', dist: 331, plat: 5 },
                    { code: 'HWH', arr: '14:35:00', dep: null, dist: 532, plat: 21 }
                ]
            },
            {
                number: '22347',
                name: 'Howrah - Patna Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '15:50:00', dist: 0, plat: 21 },
                    { code: 'ASN', arr: '18:18:00', dep: '18:20:00', dist: 201, plat: 2 },
                    { code: 'PNBE', arr: '22:20:00', dep: null, dist: 532, plat: 1 }
                ]
            },

            // ============================================================
            // 2. ICONIC RAJDHANI EXPRESSES (Flagship Indian Long-Distance)
            // ============================================================
            {
                number: '12951',
                name: 'Mumbai Central - New Delhi Rajdhani Express',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'BCT', arr: null, dep: '17:00:00', dist: 0, plat: 1 },
                    { code: 'ST', arr: '19:25:00', dep: '19:28:00', dist: 263, plat: 1 },
                    { code: 'BRC', arr: '20:53:00', dep: '20:58:00', dist: 392, plat: 2 },
                    { code: 'RTM', arr: '00:15:00', dep: '00:18:00', dist: 653, plat: 1 },
                    { code: 'KOTA', arr: '03:15:00', dep: '03:20:00', dist: 920, plat: 1 },
                    { code: 'NDLS', arr: '08:32:00', dep: null, dist: 1384, plat: 2 }
                ]
            },
            {
                number: '12952',
                name: 'New Delhi - Mumbai Central Rajdhani Express',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '16:55:00', dist: 0, plat: 2 },
                    { code: 'KOTA', arr: '21:30:00', dep: '21:35:00', dist: 464, plat: 1 },
                    { code: 'RTM', arr: '00:30:00', dep: '00:33:00', dist: 731, plat: 2 },
                    { code: 'BRC', arr: '03:40:00', dep: '03:45:00', dist: 992, plat: 1 },
                    { code: 'ST', arr: '05:15:00', dep: '05:20:00', dist: 1121, plat: 1 },
                    { code: 'BCT', arr: '08:35:00', dep: null, dist: 1384, plat: 1 }
                ]
            },
            {
                number: '12301',
                name: 'Howrah - New Delhi Rajdhani Express (via Gaya)',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
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
            {
                number: '12302',
                name: 'New Delhi - Howrah Rajdhani Express (via Gaya)',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '16:50:00', dist: 0, plat: 13 },
                    { code: 'CNB', arr: '21:32:00', dep: '21:37:00', dist: 437, plat: 1 },
                    { code: 'PRYJ', arr: '23:43:00', dep: '23:45:00', dist: 631, plat: 4 },
                    { code: 'MGS', arr: '01:42:00', dep: '01:52:00', dist: 784, plat: 2 },
                    { code: 'GAYA', arr: '03:45:00', dep: '03:48:00', dist: 989, plat: 1 },
                    { code: 'DHN', arr: '06:18:00', dep: '06:23:00', dist: 1188, plat: 1 },
                    { code: 'ASN', arr: '07:09:00', dep: '07:11:00', dist: 1247, plat: 5 },
                    { code: 'HWH', arr: '09:55:00', dep: null, dist: 1447, plat: 9 }
                ]
            },
            {
                number: '22691',
                name: 'KSR Bengaluru - Hazrat Nizamuddin Rajdhani Express',
                type: 'Rajdhani',
                total_seats: 1180,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'SBC', arr: null, dep: '20:00:00', dist: 0, plat: 8 },
                    { code: 'SC', arr: '07:05:00', dep: '07:15:00', dist: 692, plat: 10 },
                    { code: 'NGP', arr: '14:55:00', dep: '15:00:00', dist: 1267, plat: 1 },
                    { code: 'BPL', arr: '20:55:00', dep: '21:00:00', dist: 1657, plat: 2 },
                    { code: 'GWL', arr: '00:18:00', dep: '00:20:00', dist: 1949, plat: 1 },
                    { code: 'AGC', arr: '01:50:00', dep: '01:52:00', dist: 2067, plat: 2 },
                    { code: 'NZM', arr: '05:30:00', dep: null, dist: 2362, plat: 6 }
                ]
            },
            {
                number: '22692',
                name: 'Hazrat Nizamuddin - KSR Bengaluru Rajdhani Express',
                type: 'Rajdhani',
                total_seats: 1180,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NZM', arr: null, dep: '20:45:00', dist: 0, plat: 6 },
                    { code: 'AGC', arr: '23:38:00', dep: '23:40:00', dist: 188, plat: 1 },
                    { code: 'GWL', arr: '01:10:00', dep: '01:12:00', dist: 306, plat: 1 },
                    { code: 'BPL', arr: '05:20:00', dep: '05:25:00', dist: 705, plat: 1 },
                    { code: 'NGP', arr: '11:20:00', dep: '11:25:00', dist: 1095, plat: 2 },
                    { code: 'SC', arr: '19:15:00', dep: '19:25:00', dist: 1670, plat: 10 },
                    { code: 'SBC', arr: '06:40:00', dep: null, dist: 2362, plat: 8 }
                ]
            },
            {
                number: '12433',
                name: 'MGR Chennai Central - Hazrat Nizamuddin Rajdhani',
                type: 'Rajdhani',
                total_seats: 1150,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '06:05:00', dist: 0, plat: 2 },
                    { code: 'BZA', arr: '11:40:00', dep: '11:50:00', dist: 431, plat: 1 },
                    { code: 'WL', arr: '14:18:00', dep: '14:20:00', dist: 638, plat: 2 },
                    { code: 'NGP', arr: '20:25:00', dep: '20:30:00', dist: 1085, plat: 1 },
                    { code: 'BPL', arr: '02:05:00', dep: '02:10:00', dist: 1475, plat: 2 },
                    { code: 'GWL', arr: '05:33:00', dep: '05:35:00', dist: 1767, plat: 1 },
                    { code: 'AGC', arr: '07:05:00', dep: '07:07:00', dist: 1885, plat: 2 },
                    { code: 'NZM', arr: '10:30:00', dep: null, dist: 2176, plat: 7 }
                ]
            },
            {
                number: '12434',
                name: 'Hazrat Nizamuddin - MGR Chennai Central Rajdhani',
                type: 'Rajdhani',
                total_seats: 1150,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NZM', arr: null, dep: '15:35:00', dist: 0, plat: 7 },
                    { code: 'AGC', arr: '17:30:00', dep: '17:32:00', dist: 188, plat: 1 },
                    { code: 'GWL', arr: '18:53:00', dep: '18:55:00', dist: 306, plat: 1 },
                    { code: 'BPL', arr: '23:30:00', dep: '23:35:00', dist: 705, plat: 1 },
                    { code: 'NGP', arr: '05:05:00', dep: '05:10:00', dist: 1095, plat: 2 },
                    { code: 'WL', arr: '11:13:00', dep: '11:15:00', dist: 1538, plat: 1 },
                    { code: 'BZA', arr: '14:20:00', dep: '14:30:00', dist: 1745, plat: 6 },
                    { code: 'MAS', arr: '20:45:00', dep: null, dist: 2176, plat: 2 }
                ]
            },
            {
                number: '12423',
                name: 'Dibrugarh - New Delhi Rajdhani Express (via Guwahati)',
                type: 'Rajdhani',
                total_seats: 1180,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'DBRG', arr: null, dep: '20:55:00', dist: 0, plat: 1 },
                    { code: 'DMV', arr: '02:00:00', dep: '02:07:00', dist: 279, plat: 1 },
                    { code: 'GHY', arr: '06:30:00', dep: '06:45:00', dist: 557, plat: 1 },
                    { code: 'NJP', arr: '13:15:00', dep: '13:25:00', dist: 986, plat: 2 },
                    { code: 'KIR', arr: '16:20:00', dep: '16:30:00', dist: 1184, plat: 1 },
                    { code: 'PNBE', arr: '21:40:00', dep: '21:50:00', dist: 1473, plat: 1 },
                    { code: 'MGS', arr: '01:35:00', dep: '01:45:00', dist: 1685, plat: 2 },
                    { code: 'PRYJ', arr: '03:23:00', dep: '03:25:00', dist: 1838, plat: 1 },
                    { code: 'CNB', arr: '05:20:00', dep: '05:25:00', dist: 2032, plat: 1 },
                    { code: 'NDLS', arr: '10:30:00', dep: null, dist: 2469, plat: 16 }
                ]
            },
            {
                number: '12424',
                name: 'New Delhi - Dibrugarh Rajdhani Express',
                type: 'Rajdhani',
                total_seats: 1180,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '16:20:00', dist: 0, plat: 16 },
                    { code: 'CNB', arr: '21:02:00', dep: '21:07:00', dist: 437, plat: 1 },
                    { code: 'PRYJ', arr: '23:08:00', dep: '23:10:00', dist: 631, plat: 4 },
                    { code: 'MGS', arr: '01:23:00', dep: '01:33:00', dist: 784, plat: 2 },
                    { code: 'PNBE', arr: '04:15:00', dep: '04:25:00', dist: 996, plat: 1 },
                    { code: 'KIR', arr: '09:45:00', dep: '09:55:00', dist: 1285, plat: 1 },
                    { code: 'NJP', arr: '13:05:00', dep: '13:15:00', dist: 1483, plat: 1 },
                    { code: 'GHY', arr: '19:30:00', dep: '19:45:00', dist: 1912, plat: 1 },
                    { code: 'DMV', arr: '00:03:00', dep: '00:10:00', dist: 2190, plat: 1 },
                    { code: 'DBRG', arr: '06:00:00', dep: null, dist: 2469, plat: 1 }
                ]
            },
            {
                number: '12431',
                name: 'Thiruvananthapuram - Hazrat Nizamuddin Rajdhani (via Konkan)',
                type: 'Rajdhani',
                total_seats: 1160,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'TVC', arr: null, dep: '19:15:00', dist: 0, plat: 1 },
                    { code: 'QLN', arr: '20:11:00', dep: '20:13:00', dist: 65, plat: 2 },
                    { code: 'ERS', arr: '22:30:00', dep: '22:35:00', dist: 206, plat: 1 },
                    { code: 'CLT', arr: '01:17:00', dep: '01:20:00', dist: 399, plat: 3 },
                    { code: 'MAJN', arr: '04:20:00', dep: '04:25:00', dist: 636, plat: 1 },
                    { code: 'MAO', arr: '10:00:00', dep: '10:10:00', dist: 949, plat: 1 },
                    { code: 'PNVL', arr: '18:00:00', dep: '18:05:00', dist: 1541, plat: 5 },
                    { code: 'ST', arr: '22:15:00', dep: '22:18:00', dist: 1823, plat: 1 },
                    { code: 'BRC', arr: '23:51:00', dep: '23:59:00', dist: 1952, plat: 2 },
                    { code: 'RTM', arr: '03:15:00', dep: '03:18:00', dist: 2213, plat: 1 },
                    { code: 'KOTA', arr: '06:45:00', dep: '06:50:00', dist: 2480, plat: 1 },
                    { code: 'NZM', arr: '12:30:00', dep: null, dist: 2944, plat: 4 }
                ]
            },
            {
                number: '12432',
                name: 'Hazrat Nizamuddin - Thiruvananthapuram Rajdhani (via Konkan)',
                type: 'Rajdhani',
                total_seats: 1160,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NZM', arr: null, dep: '06:16:00', dist: 0, plat: 4 },
                    { code: 'KOTA', arr: '10:40:00', dep: '10:50:00', dist: 464, plat: 1 },
                    { code: 'RTM', arr: '14:02:00', dep: '14:05:00', dist: 731, plat: 2 },
                    { code: 'BRC', arr: '17:27:00', dep: '17:37:00', dist: 992, plat: 1 },
                    { code: 'ST', arr: '19:14:00', dep: '19:17:00', dist: 1121, plat: 2 },
                    { code: 'PNVL', arr: '23:05:00', dep: '23:10:00', dist: 1403, plat: 7 },
                    { code: 'MAO', arr: '08:30:00', dep: '08:40:00', dist: 1995, plat: 2 },
                    { code: 'MAJN', arr: '14:00:00', dep: '14:05:00', dist: 2308, plat: 2 },
                    { code: 'CLT', arr: '17:12:00', dep: '17:15:00', dist: 2545, plat: 1 },
                    { code: 'ERS', arr: '20:15:00', dep: '20:20:00', dist: 2738, plat: 1 },
                    { code: 'QLN', arr: '22:15:00', dep: '22:18:00', dist: 2879, plat: 1 },
                    { code: 'TVC', arr: '23:35:00', dep: null, dist: 2944, plat: 1 }
                ]
            },

            // ============================================================
            // 3. SHATABDI & DURONTO EXPRESSES
            // ============================================================
            {
                number: '12002',
                name: 'New Delhi - Rani Kamalapati (Bhopal) Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1250,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '06:00:00', dist: 0, plat: 1 },
                    { code: 'MTJ', arr: '07:19:00', dep: '07:20:00', dist: 141, plat: 1 },
                    { code: 'AGC', arr: '07:50:00', dep: '07:55:00', dist: 195, plat: 1 },
                    { code: 'GWL', arr: '09:23:00', dep: '09:28:00', dist: 313, plat: 1 },
                    { code: 'JHS', arr: '10:45:00', dep: '10:50:00', dist: 410, plat: 1 },
                    { code: 'BPL', arr: '14:12:00', dep: '14:15:00', dist: 702, plat: 1 },
                    { code: 'RKMP', arr: '14:40:00', dep: null, dist: 708, plat: 1 }
                ]
            },
            {
                number: '12001',
                name: 'Rani Kamalapati (Bhopal) - New Delhi Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1250,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'RKMP', arr: null, dep: '15:15:00', dist: 0, plat: 1 },
                    { code: 'BPL', arr: '15:27:00', dep: '15:30:00', dist: 6, plat: 2 },
                    { code: 'JHS', arr: '18:40:00', dep: '18:45:00', dist: 298, plat: 4 },
                    { code: 'GWL', arr: '19:45:00', dep: '19:50:00', dist: 395, plat: 2 },
                    { code: 'AGC', arr: '21:10:00', dep: '21:15:00', dist: 513, plat: 1 },
                    { code: 'MTJ', arr: '21:58:00', dep: '22:00:00', dist: 567, plat: 2 },
                    { code: 'NDLS', arr: '23:50:00', dep: null, dist: 708, plat: 1 }
                ]
            },
            {
                number: '12004',
                name: 'New Delhi - Lucknow Swarna Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '06:10:00', dist: 0, plat: 9 },
                    { code: 'GZB', arr: '06:48:00', dep: '06:50:00', dist: 26, plat: 2 },
                    { code: 'ALJN', arr: '07:49:00', dep: '07:51:00', dist: 131, plat: 3 },
                    { code: 'CNB', arr: '11:20:00', dep: '11:25:00', dist: 440, plat: 1 },
                    { code: 'LJN', arr: '12:45:00', dep: null, dist: 512, plat: 6 }
                ]
            },
            {
                number: '12003',
                name: 'Lucknow - New Delhi Swarna Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'LJN', arr: null, dep: '15:30:00', dist: 0, plat: 6 },
                    { code: 'CNB', arr: '16:50:00', dep: '16:55:00', dist: 72, plat: 1 },
                    { code: 'ALJN', arr: '20:15:00', dep: '20:17:00', dist: 381, plat: 3 },
                    { code: 'GZB', arr: '21:33:00', dep: '21:35:00', dist: 486, plat: 1 },
                    { code: 'NDLS', arr: '22:25:00', dep: null, dist: 512, plat: 9 }
                ]
            },
            {
                number: '12011',
                name: 'New Delhi - Kalka Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1100,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '07:40:00', dist: 0, plat: 1 },
                    { code: 'PNP', arr: '08:51:00', dep: '08:53:00', dist: 89, plat: 3 },
                    { code: 'UMB', arr: '10:02:00', dep: '10:04:00', dist: 198, plat: 7 },
                    { code: 'CDG', arr: '10:45:00', dep: '10:50:00', dist: 243, plat: 1 },
                    { code: 'KLK', arr: '11:45:00', dep: null, dist: 280, plat: 1 }
                ]
            },
            {
                number: '12012',
                name: 'Kalka - New Delhi Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1100,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'KLK', arr: null, dep: '17:45:00', dist: 0, plat: 1 },
                    { code: 'CDG', arr: '18:18:00', dep: '18:23:00', dist: 37, plat: 2 },
                    { code: 'UMB', arr: '19:08:00', dep: '19:10:00', dist: 82, plat: 6 },
                    { code: 'PNP', arr: '20:22:00', dep: '20:24:00', dist: 191, plat: 2 },
                    { code: 'NDLS', arr: '21:55:00', dep: null, dist: 280, plat: 1 }
                ]
            },
            {
                number: '12019',
                name: 'Howrah - Ranchi Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1150,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '06:05:00', dist: 0, plat: 10 },
                    { code: 'DGR', arr: '07:48:00', dep: '07:50:00', dist: 171, plat: 3 },
                    { code: 'ASN', arr: '08:22:00', dep: '08:24:00', dist: 213, plat: 4 },
                    { code: 'DHN', arr: '09:20:00', dep: '09:25:00', dist: 271, plat: 1 },
                    { code: 'BKSC', arr: '10:55:00', dep: '11:00:00', dist: 350, plat: 1 },
                    { code: 'RNC', arr: '13:15:00', dep: null, dist: 435, plat: 1 }
                ]
            },
            {
                number: '12020',
                name: 'Ranchi - Howrah Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1150,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'RNC', arr: null, dep: '13:45:00', dist: 0, plat: 1 },
                    { code: 'BKSC', arr: '15:35:00', dep: '15:40:00', dist: 85, plat: 1 },
                    { code: 'DHN', arr: '17:15:00', dep: '17:20:00', dist: 164, plat: 1 },
                    { code: 'ASN', arr: '18:11:00', dep: '18:13:00', dist: 222, plat: 5 },
                    { code: 'DGR', arr: '18:43:00', dep: '18:45:00', dist: 264, plat: 4 },
                    { code: 'HWH', arr: '21:30:00', dep: null, dist: 435, plat: 10 }
                ]
            },
            {
                number: '12028',
                name: 'KSR Bengaluru - MGR Chennai Central Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'SBC', arr: null, dep: '06:00:00', dist: 0, plat: 7 },
                    { code: 'BNC', arr: '06:10:00', dep: '06:12:00', dist: 5, plat: 2 },
                    { code: 'MAS', arr: '11:00:00', dep: null, dist: 358, plat: 2 }
                ]
            },
            {
                number: '12027',
                name: 'MGR Chennai Central - KSR Bengaluru Shatabdi Express',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '17:30:00', dist: 0, plat: 2 },
                    { code: 'BNC', arr: '22:08:00', dep: '22:10:00', dist: 353, plat: 1 },
                    { code: 'SBC', arr: '22:30:00', dep: null, dist: 358, plat: 7 }
                ]
            },

            // ============================================================
            // 4. PAN-INDIA SUPERFAST & MAIL CORRIDORS (North, South, East, West)
            // ============================================================
            // Grand Trunk Express (Delhi - Chennai Trunk)
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
                    { code: 'JHS', arr: '22:05:00', dep: '22:15:00', dist: 410, plat: 2 },
                    { code: 'BPL', arr: '02:05:00', dep: '02:15:00', dist: 702, plat: 1 },
                    { code: 'ET', arr: '04:00:00', dep: '04:10:00', dist: 794, plat: 3 },
                    { code: 'NGP', arr: '09:20:00', dep: '09:25:00', dist: 1092, plat: 2 },
                    { code: 'CD', arr: '12:00:00', dep: '12:02:00', dist: 1289, plat: 1 },
                    { code: 'WL', arr: '15:20:00', dep: '15:25:00', dist: 1535, plat: 1 },
                    { code: 'BZA', arr: '19:40:00', dep: '19:50:00', dist: 1742, plat: 5 },
                    { code: 'OGL', arr: '21:58:00', dep: '22:00:00', dist: 1881, plat: 3 },
                    { code: 'NLR', arr: '23:28:00', dep: '23:30:00', dist: 1997, plat: 3 },
                    { code: 'MAS', arr: '04:30:00', dep: null, dist: 2182, plat: 3 }
                ]
            },
            {
                number: '12615',
                name: 'Grand Trunk Express (MAS - NDLS)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '18:50:00', dist: 0, plat: 3 },
                    { code: 'NLR', arr: '21:18:00', dep: '21:20:00', dist: 185, plat: 2 },
                    { code: 'OGL', arr: '22:48:00', dep: '22:50:00', dist: 301, plat: 1 },
                    { code: 'BZA', arr: '01:25:00', dep: '01:35:00', dist: 440, plat: 6 },
                    { code: 'WL', arr: '04:35:00', dep: '04:40:00', dist: 647, plat: 2 },
                    { code: 'CD', arr: '08:28:00', dep: '08:30:00', dist: 893, plat: 2 },
                    { code: 'NGP', arr: '11:40:00', dep: '11:45:00', dist: 1090, plat: 1 },
                    { code: 'ET', arr: '16:50:00', dep: '17:00:00', dist: 1388, plat: 1 },
                    { code: 'BPL', arr: '18:40:00', dep: '18:45:00', dist: 1480, plat: 2 },
                    { code: 'JHS', arr: '22:50:00', dep: '22:58:00', dist: 1772, plat: 1 },
                    { code: 'GWL', arr: '00:08:00', dep: '00:10:00', dist: 1869, plat: 2 },
                    { code: 'AGC', arr: '01:50:00', dep: '01:55:00', dist: 1987, plat: 2 },
                    { code: 'NDLS', arr: '06:35:00', dep: null, dist: 2182, plat: 4 }
                ]
            },

            // Tamil Nadu Express
            {
                number: '12621',
                name: 'Tamil Nadu Express (MAS - NDLS)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '22:00:00', dist: 0, plat: 5 },
                    { code: 'BZA', arr: '03:55:00', dep: '04:05:00', dist: 431, plat: 6 },
                    { code: 'WL', arr: '06:50:00', dep: '06:52:00', dist: 638, plat: 2 },
                    { code: 'NGP', arr: '13:50:00', dep: '13:55:00', dist: 1085, plat: 1 },
                    { code: 'BPL', arr: '20:10:00', dep: '20:20:00', dist: 1475, plat: 2 },
                    { code: 'JHS', arr: '00:26:00', dep: '00:34:00', dist: 1767, plat: 1 },
                    { code: 'AGC', arr: '03:15:00', dep: '03:17:00', dist: 1982, plat: 2 },
                    { code: 'NDLS', arr: '07:05:00', dep: null, dist: 2182, plat: 4 }
                ]
            },
            {
                number: '12622',
                name: 'Tamil Nadu Express (NDLS - MAS)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '21:05:00', dist: 0, plat: 3 },
                    { code: 'AGC', arr: '23:25:00', dep: '23:27:00', dist: 195, plat: 1 },
                    { code: 'GWL', arr: '01:13:00', dep: '01:15:00', dist: 313, plat: 1 },
                    { code: 'JHS', arr: '02:35:00', dep: '02:43:00', dist: 410, plat: 2 },
                    { code: 'BPL', arr: '06:45:00', dep: '06:50:00', dist: 702, plat: 1 },
                    { code: 'NGP', arr: '13:05:00', dep: '13:10:00', dist: 1092, plat: 2 },
                    { code: 'WL', arr: '19:43:00', dep: '19:45:00', dist: 1535, plat: 1 },
                    { code: 'BZA', arr: '23:15:00', dep: '23:25:00', dist: 1742, plat: 5 },
                    { code: 'MAS', arr: '06:15:00', dep: null, dist: 2182, plat: 5 }
                ]
            },

            // Karnataka Express (Delhi - Bengaluru)
            {
                number: '12628',
                name: 'Karnataka Express (NDLS - SBC)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '20:20:00', dist: 0, plat: 3 },
                    { code: 'AGC', arr: '22:48:00', dep: '22:50:00', dist: 195, plat: 1 },
                    { code: 'GWL', arr: '00:46:00', dep: '00:48:00', dist: 313, plat: 1 },
                    { code: 'JHS', arr: '02:20:00', dep: '02:28:00', dist: 410, plat: 2 },
                    { code: 'BPL', arr: '06:25:00', dep: '06:30:00', dist: 702, plat: 1 },
                    { code: 'ET', arr: '08:20:00', dep: '08:30:00', dist: 794, plat: 2 },
                    { code: 'BSL', arr: '13:10:00', dep: '13:15:00', dist: 1101, plat: 3 },
                    { code: 'MMR', arr: '15:40:00', dep: '15:45:00', dist: 1285, plat: 4 },
                    { code: 'SUR', arr: '23:35:00', dep: '23:40:00', dist: 1774, plat: 1 },
                    { code: 'KLBG', arr: '01:22:00', dep: '01:25:00', dist: 1887, plat: 2 },
                    { code: 'SBC', arr: '12:00:00', dep: null, dist: 2410, plat: 1 }
                ]
            },
            {
                number: '12627',
                name: 'Karnataka Express (SBC - NDLS)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SBC', arr: null, dep: '19:20:00', dist: 0, plat: 1 },
                    { code: 'KLBG', arr: '05:40:00', dep: '05:43:00', dist: 523, plat: 1 },
                    { code: 'SUR', arr: '07:15:00', dep: '07:20:00', dist: 636, plat: 1 },
                    { code: 'MMR', arr: '14:55:00', dep: '15:00:00', dist: 1125, plat: 1 },
                    { code: 'BSL', arr: '17:15:00', dep: '17:20:00', dist: 1309, plat: 6 },
                    { code: 'ET', arr: '22:40:00', dep: '22:50:00', dist: 1616, plat: 1 },
                    { code: 'BPL', arr: '00:10:00', dep: '00:20:00', dist: 1708, plat: 2 },
                    { code: 'JHS', arr: '04:15:00', dep: '04:23:00', dist: 2000, plat: 1 },
                    { code: 'GWL', arr: '05:33:00', dep: '05:35:00', dist: 2097, plat: 2 },
                    { code: 'AGC', arr: '07:10:00', dep: '07:15:00', dist: 2215, plat: 2 },
                    { code: 'NDLS', arr: '10:40:00', dep: null, dist: 2410, plat: 3 }
                ]
            },

            // Kerala Express (Delhi - Trivandrum)
            {
                number: '12626',
                name: 'Kerala Express (NDLS - TVC)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '20:10:00', dist: 0, plat: 6 },
                    { code: 'AGC', arr: '22:20:00', dep: '22:25:00', dist: 195, plat: 1 },
                    { code: 'GWL', arr: '00:03:00', dep: '00:05:00', dist: 313, plat: 1 },
                    { code: 'JHS', arr: '01:30:00', dep: '01:38:00', dist: 410, plat: 2 },
                    { code: 'BPL', arr: '05:20:00', dep: '05:25:00', dist: 702, plat: 1 },
                    { code: 'NGP', arr: '11:45:00', dep: '11:50:00', dist: 1092, plat: 2 },
                    { code: 'WL', arr: '18:18:00', dep: '18:20:00', dist: 1535, plat: 1 },
                    { code: 'BZA', arr: '22:10:00', dep: '22:20:00', dist: 1742, plat: 6 },
                    { code: 'RU', arr: '04:15:00', dep: '04:20:00', dist: 2118, plat: 3 },
                    { code: 'SA', arr: '09:52:00', dep: '09:55:00', dist: 2445, plat: 1 },
                    { code: 'ED', arr: '10:55:00', dep: '11:00:00', dist: 2505, plat: 2 },
                    { code: 'CBE', arr: '12:27:00', dep: '12:30:00', dist: 2605, plat: 1 },
                    { code: 'PGT', arr: '13:50:00', dep: '13:55:00', dist: 2661, plat: 2 },
                    { code: 'TCR', arr: '15:27:00', dep: '15:30:00', dist: 2737, plat: 1 },
                    { code: 'ERN', arr: '16:55:00', dep: '17:00:00', dist: 2811, plat: 2 },
                    { code: 'KTYM', arr: '18:12:00', dep: '18:15:00', dist: 2871, plat: 1 },
                    { code: 'QLN', arr: '20:12:00', dep: '20:15:00', dist: 2966, plat: 1 },
                    { code: 'TVC', arr: '22:00:00', dep: null, dist: 3031, plat: 1 }
                ]
            },
            {
                number: '12625',
                name: 'Kerala Express (TVC - NDLS)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'TVC', arr: null, dep: '12:30:00', dist: 0, plat: 1 },
                    { code: 'QLN', arr: '13:30:00', dep: '13:33:00', dist: 65, plat: 2 },
                    { code: 'KTYM', arr: '15:17:00', dep: '15:20:00', dist: 160, plat: 1 },
                    { code: 'ERN', arr: '16:40:00', dep: '16:45:00', dist: 220, plat: 1 },
                    { code: 'TCR', arr: '17:42:00', dep: '17:45:00', dist: 294, plat: 2 },
                    { code: 'PGT', arr: '19:12:00', dep: '19:15:00', dist: 370, plat: 4 },
                    { code: 'CBE', arr: '20:52:00', dep: '20:55:00', dist: 426, plat: 2 },
                    { code: 'ED', arr: '22:20:00', dep: '22:25:00', dist: 526, plat: 1 },
                    { code: 'SA', arr: '23:22:00', dep: '23:25:00', dist: 586, plat: 5 },
                    { code: 'RU', arr: '04:45:00', dep: '04:50:00', dist: 913, plat: 1 },
                    { code: 'BZA', arr: '10:55:00', dep: '11:05:00', dist: 1289, plat: 6 },
                    { code: 'WL', arr: '14:18:00', dep: '14:20:00', dist: 1496, plat: 2 },
                    { code: 'NGP', arr: '21:10:00', dep: '21:15:00', dist: 1939, plat: 1 },
                    { code: 'BPL', arr: '03:45:00', dep: '03:55:00', dist: 2329, plat: 2 },
                    { code: 'JHS', arr: '08:05:00', dep: '08:13:00', dist: 2621, plat: 1 },
                    { code: 'GWL', arr: '09:28:00', dep: '09:30:00', dist: 2718, plat: 2 },
                    { code: 'AGC', arr: '11:45:00', dep: '11:50:00', dist: 2836, plat: 2 },
                    { code: 'NDLS', arr: '14:40:00', dep: null, dist: 3031, plat: 6 }
                ]
            },

            // Coromandel Express (Howrah - Chennai)
            {
                number: '12841',
                name: 'Coromandel Express (HWH - MAS)',
                type: 'Superfast',
                total_seats: 1920,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '15:20:00', dist: 0, plat: 22 },
                    { code: 'KGP', arr: '16:55:00', dep: '17:00:00', dist: 115, plat: 3 },
                    { code: 'CTC', arr: '21:40:00', dep: '21:45:00', dist: 409, plat: 4 },
                    { code: 'BBS', arr: '22:20:00', dep: '22:25:00', dist: 437, plat: 4 },
                    { code: 'BAM', arr: '00:30:00', dep: '00:35:00', dist: 603, plat: 2 },
                    { code: 'VSKP', arr: '04:25:00', dep: '04:45:00', dist: 881, plat: 1 },
                    { code: 'RJY', arr: '07:33:00', dep: '07:35:00', dist: 1081, plat: 1 },
                    { code: 'BZA', arr: '10:00:00', dep: '10:10:00', dist: 1231, plat: 1 },
                    { code: 'MAS', arr: '16:50:00', dep: null, dist: 1662, plat: 4 }
                ]
            },
            {
                number: '12842',
                name: 'Coromandel Express (MAS - HWH)',
                type: 'Superfast',
                total_seats: 1920,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.6 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '07:00:00', dist: 0, plat: 4 },
                    { code: 'BZA', arr: '13:00:00', dep: '13:10:00', dist: 431, plat: 6 },
                    { code: 'RJY', arr: '15:18:00', dep: '15:20:00', dist: 581, plat: 3 },
                    { code: 'VSKP', arr: '19:05:00', dep: '19:25:00', dist: 781, plat: 1 },
                    { code: 'BAM', arr: '23:05:00', dep: '23:10:00', dist: 1059, plat: 1 },
                    { code: 'BBS', arr: '01:50:00', dep: '01:55:00', dist: 1225, plat: 1 },
                    { code: 'CTC', arr: '02:30:00', dep: '02:35:00', dist: 1253, plat: 1 },
                    { code: 'KGP', arr: '08:00:00', dep: '08:05:00', dist: 1547, plat: 1 },
                    { code: 'HWH', arr: '10:40:00', dep: null, dist: 1662, plat: 22 }
                ]
            },

            // Gitanjali Express (Mumbai - Howrah)
            {
                number: '12859',
                name: 'Gitanjali Express (CSMT - HWH)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '06:00:00', dist: 0, plat: 18 },
                    { code: 'KYN', arr: '06:52:00', dep: '06:55:00', dist: 54, plat: 4 },
                    { code: 'NK', arr: '09:25:00', dep: '09:30:00', dist: 187, plat: 2 },
                    { code: 'BSL', arr: '13:00:00', dep: '13:05:00', dist: 444, plat: 3 },
                    { code: 'AK', arr: '15:10:00', dep: '15:15:00', dist: 584, plat: 2 },
                    { code: 'NGP', arr: '18:55:00', dep: '19:00:00', dist: 837, plat: 3 },
                    { code: 'DURG', arr: '22:30:00', dep: '22:35:00', dist: 1102, plat: 2 },
                    { code: 'R', arr: '23:15:00', dep: '23:20:00', dist: 1139, plat: 1 },
                    { code: 'BSP', arr: '01:05:00', dep: '01:20:00', dist: 1250, plat: 1 },
                    { code: 'ROU', arr: '05:15:00', dep: '05:25:00', dist: 1555, plat: 4 },
                    { code: 'TATA', arr: '07:45:00', dep: '07:55:00', dist: 1756, plat: 4 },
                    { code: 'KGP', arr: '09:55:00', dep: '10:00:00', dist: 1892, plat: 6 },
                    { code: 'HWH', arr: '12:30:00', dep: null, dist: 2007, plat: 19 }
                ]
            },
            {
                number: '12860',
                name: 'Gitanjali Express (HWH - CSMT)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '14:05:00', dist: 0, plat: 19 },
                    { code: 'KGP', arr: '15:40:00', dep: '15:45:00', dist: 115, plat: 3 },
                    { code: 'TATA', arr: '17:40:00', dep: '17:50:00', dist: 251, plat: 3 },
                    { code: 'ROU', arr: '20:10:00', dep: '20:20:00', dist: 452, plat: 1 },
                    { code: 'BSP', arr: '00:25:00', dep: '00:40:00', dist: 757, plat: 1 },
                    { code: 'R', arr: '02:15:00', dep: '02:20:00', dist: 868, plat: 1 },
                    { code: 'DURG', arr: '03:10:00', dep: '03:15:00', dist: 905, plat: 1 },
                    { code: 'NGP', arr: '07:40:00', dep: '07:45:00', dist: 1170, plat: 3 },
                    { code: 'AK', arr: '11:00:00', dep: '11:05:00', dist: 1423, plat: 1 },
                    { code: 'BSL', arr: '13:40:00', dep: '13:45:00', dist: 1563, plat: 4 },
                    { code: 'NK', arr: '17:05:00', dep: '17:10:00', dist: 1820, plat: 3 },
                    { code: 'KYN', arr: '20:02:00', dep: '20:05:00', dist: 1953, plat: 5 },
                    { code: 'CSMT', arr: '21:20:00', dep: null, dist: 2007, plat: 18 }
                ]
            },

            // Sanghamitra Express (Bengaluru - Patna via Central/East trunk)
            {
                number: '12295',
                name: 'Sanghamitra Superfast Express (SBC - PNBE)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SBC', arr: null, dep: '09:15:00', dist: 0, plat: 1 },
                    { code: 'MAS', arr: '15:15:00', dep: '15:40:00', dist: 358, plat: 4 },
                    { code: 'OGL', arr: '20:38:00', dep: '20:40:00', dist: 659, plat: 1 },
                    { code: 'BZA', arr: '23:05:00', dep: '23:15:00', dist: 798, plat: 6 },
                    { code: 'WL', arr: '02:05:00', dep: '02:10:00', dist: 1005, plat: 2 },
                    { code: 'NGP', arr: '08:35:00', dep: '08:40:00', dist: 1448, plat: 1 },
                    { code: 'ET', arr: '13:40:00', dep: '13:50:00', dist: 1746, plat: 3 },
                    { code: 'JBP', arr: '17:15:00', dep: '17:25:00', dist: 1991, plat: 2 },
                    { code: 'STA', arr: '20:35:00', dep: '20:40:00', dist: 2180, plat: 2 },
                    { code: 'PRYJ', arr: '00:40:00', dep: '01:05:00', dist: 2357, plat: 4 },
                    { code: 'MGS', arr: '03:55:00', dep: '04:05:00', dist: 2510, plat: 1 },
                    { code: 'PNBE', arr: '07:40:00', dep: null, dist: 2722, plat: 1 }
                ]
            },
            {
                number: '12296',
                name: 'Sanghamitra Superfast Express (PNBE - SBC)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.85 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'PNBE', arr: null, dep: '20:10:00', dist: 0, plat: 1 },
                    { code: 'MGS', arr: '23:15:00', dep: '23:25:00', dist: 212, plat: 2 },
                    { code: 'PRYJ', arr: '01:40:00', dep: '02:05:00', dist: 365, plat: 5 },
                    { code: 'STA', arr: '05:30:00', dep: '05:35:00', dist: 542, plat: 1 },
                    { code: 'JBP', arr: '08:25:00', dep: '08:35:00', dist: 731, plat: 1 },
                    { code: 'ET', arr: '12:20:00', dep: '12:30:00', dist: 976, plat: 4 },
                    { code: 'NGP', arr: '17:40:00', dep: '17:45:00', dist: 1274, plat: 2 },
                    { code: 'WL', arr: '00:03:00', dep: '00:05:00', dist: 1717, plat: 1 },
                    { code: 'BZA', arr: '03:15:00', dep: '03:25:00', dist: 1924, plat: 1 },
                    { code: 'OGL', arr: '05:24:00', dep: '05:25:00', dist: 2063, plat: 3 },
                    { code: 'MAS', arr: '09:40:00', dep: '10:05:00', dist: 2364, plat: 4 },
                    { code: 'SBC', arr: '16:10:00', dep: null, dist: 2722, plat: 1 }
                ]
            },

            // Golden Temple Mail (Mumbai - Amritsar)
            {
                number: '12903',
                name: 'Golden Temple Mail (BCT - ASR)',
                type: 'Mail',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BCT', arr: null, dep: '18:45:00', dist: 0, plat: 3 },
                    { code: 'ST', arr: '22:10:00', dep: '22:15:00', dist: 263, plat: 1 },
                    { code: 'BRC', arr: '23:40:00', dep: '23:50:00', dist: 392, plat: 2 },
                    { code: 'RTM', arr: '03:30:00', dep: '03:35:00', dist: 653, plat: 1 },
                    { code: 'KOTA', arr: '07:10:00', dep: '07:20:00', dist: 920, plat: 1 },
                    { code: 'SWM', arr: '08:30:00', dep: '08:35:00', dist: 1028, plat: 1 },
                    { code: 'MTJ', arr: '11:45:00', dep: '11:50:00', dist: 1244, plat: 2 },
                    { code: 'NZM', arr: '13:50:00', dep: '14:05:00', dist: 1378, plat: 6 },
                    { code: 'GZB', arr: '14:43:00', dep: '14:45:00', dist: 1409, plat: 1 },
                    { code: 'MTC', arr: '15:25:00', dep: '15:30:00', dist: 1453, plat: 1 },
                    { code: 'SRE', arr: '17:32:00', dep: '17:40:00', dist: 1567, plat: 4 },
                    { code: 'UMB', arr: '19:05:00', dep: '19:10:00', dist: 1648, plat: 7 },
                    { code: 'LDH', arr: '20:43:00', dep: '20:53:00', dist: 1762, plat: 2 },
                    { code: 'JUC', arr: '21:50:00', dep: '21:55:00', dist: 1819, plat: 1 },
                    { code: 'ASR', arr: '23:45:00', dep: null, dist: 1898, plat: 1 }
                ]
            },
            {
                number: '12904',
                name: 'Golden Temple Mail (ASR - BCT)',
                type: 'Mail',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'ASR', arr: null, dep: '18:55:00', dist: 0, plat: 1 },
                    { code: 'JUC', arr: '20:00:00', dep: '20:05:00', dist: 79, plat: 2 },
                    { code: 'LDH', arr: '21:05:00', dep: '21:15:00', dist: 136, plat: 1 },
                    { code: 'UMB', arr: '22:50:00', dep: '22:55:00', dist: 250, plat: 6 },
                    { code: 'SRE', arr: '00:15:00', dep: '00:20:00', dist: 331, plat: 3 },
                    { code: 'MTC', arr: '01:57:00', dep: '02:02:00', dist: 445, plat: 2 },
                    { code: 'GZB', arr: '02:50:00', dep: '02:52:00', dist: 489, plat: 2 },
                    { code: 'NZM', arr: '03:45:00', dep: '04:00:00', dist: 520, plat: 3 },
                    { code: 'MTJ', arr: '05:48:00', dep: '05:50:00', dist: 654, plat: 3 },
                    { code: 'SWM', arr: '08:25:00', dep: '08:30:00', dist: 870, plat: 2 },
                    { code: 'KOTA', arr: '09:40:00', dep: '09:50:00', dist: 978, plat: 2 },
                    { code: 'RTM', arr: '13:40:00', dep: '13:45:00', dist: 1245, plat: 2 },
                    { code: 'BRC', arr: '18:00:00', dep: '18:10:00', dist: 1506, plat: 1 },
                    { code: 'ST', arr: '19:46:00', dep: '19:51:00', dist: 1635, plat: 2 },
                    { code: 'BCT', arr: '23:35:00', dep: null, dist: 1898, plat: 3 }
                ]
            },

            // Deccan Queen (Mumbai - Pune Iconic Express)
            {
                number: '12123',
                name: 'Deccan Queen Superfast Express (CSMT - PNQ)',
                type: 'Superfast',
                total_seats: 1300,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 700, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '17:10:00', dist: 0, plat: 8 },
                    { code: 'KYN', arr: '18:08:00', dep: '18:10:00', dist: 54, plat: 5 },
                    { code: 'PNQ', arr: '20:25:00', dep: null, dist: 192, plat: 5 }
                ]
            },
            {
                number: '12124',
                name: 'Deccan Queen Superfast Express (PNQ - CSMT)',
                type: 'Superfast',
                total_seats: 1300,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 700, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'PNQ', arr: null, dep: '07:15:00', dist: 0, plat: 5 },
                    { code: 'KYN', arr: '09:33:00', dep: '09:35:00', dist: 138, plat: 7 },
                    { code: 'CSMT', arr: '10:25:00', dep: null, dist: 192, plat: 8 }
                ]
            },

            // Karnavati Express (Mumbai - Ahmedabad)
            {
                number: '12933',
                name: 'Karnavati Express (BCT - ADI)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 300, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 800, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'BCT', arr: null, dep: '14:05:00', dist: 0, plat: 4 },
                    { code: 'VAPI', arr: '16:01:00', dep: '16:03:00', dist: 168, plat: 1 },
                    { code: 'BL', arr: '16:24:00', dep: '16:26:00', dist: 194, plat: 2 },
                    { code: 'ST', arr: '17:15:00', dep: '17:20:00', dist: 263, plat: 1 },
                    { code: 'BH', arr: '18:03:00', dep: '18:05:00', dist: 322, plat: 3 },
                    { code: 'BRC', arr: '19:00:00', dep: '19:05:00', dist: 392, plat: 2 },
                    { code: 'ANND', arr: '19:40:00', dep: '19:42:00', dist: 428, plat: 3 },
                    { code: 'ADI', arr: '21:05:00', dep: null, dist: 491, plat: 8 }
                ]
            },
            {
                number: '12934',
                name: 'Karnavati Express (ADI - BCT)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 300, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 800, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'ADI', arr: null, dep: '05:00:00', dist: 0, plat: 8 },
                    { code: 'ANND', arr: '05:49:00', dep: '05:51:00', dist: 63, plat: 4 },
                    { code: 'BRC', arr: '06:23:00', dep: '06:28:00', dist: 99, plat: 1 },
                    { code: 'BH', arr: '07:18:00', dep: '07:20:00', dist: 169, plat: 4 },
                    { code: 'ST', arr: '08:08:00', dep: '08:13:00', dist: 228, plat: 2 },
                    { code: 'BL', arr: '09:08:00', dep: '09:10:00', dist: 297, plat: 3 },
                    { code: 'VAPI', arr: '09:31:00', dep: '09:33:00', dist: 323, plat: 2 },
                    { code: 'BCT', arr: '12:20:00', dep: null, dist: 491, plat: 4 }
                ]
            },

            // Konkan Kanya Express (Mumbai - Goa - Madgaon)
            {
                number: '20111',
                name: 'Konkan Kanya Superfast Express (CSMT - MAO)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '23:05:00', dist: 0, plat: 17 },
                    { code: 'TNA', arr: '23:43:00', dep: '23:45:00', dist: 34, plat: 5 },
                    { code: 'PNVL', arr: '00:25:00', dep: '00:30:00', dist: 69, plat: 7 },
                    { code: 'THVM', arr: '08:52:00', dep: '08:54:00', dist: 534, plat: 1 },
                    { code: 'MAO', arr: '10:45:00', dep: null, dist: 580, plat: 2 }
                ]
            },
            {
                number: '20112',
                name: 'Konkan Kanya Superfast Express (MAO - CSMT)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAO', arr: null, dep: '18:00:00', dist: 0, plat: 2 },
                    { code: 'THVM', arr: '19:00:00', dep: '19:02:00', dist: 46, plat: 1 },
                    { code: 'PNVL', arr: '04:00:00', dep: '04:05:00', dist: 511, plat: 7 },
                    { code: 'TNA', arr: '04:43:00', dep: '04:45:00', dist: 546, plat: 6 },
                    { code: 'CSMT', arr: '05:40:00', dep: null, dist: 580, plat: 17 }
                ]
            },

            // Ashram Express (Delhi - Jaipur - Ahmedabad)
            {
                number: '12916',
                name: 'Ashram Express (DLI - ADI)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DLI', arr: null, dep: '15:20:00', dist: 0, plat: 3 },
                    { code: 'DEC', arr: '15:53:00', dep: '15:55:00', dist: 14, plat: 1 },
                    { code: 'JP', arr: '20:15:00', dep: '20:25:00', dist: 308, plat: 1 },
                    { code: 'AII', arr: '22:30:00', dep: '22:40:00', dist: 443, plat: 2 },
                    { code: 'ABR', arr: '02:30:00', dep: '02:40:00', dist: 748, plat: 1 },
                    { code: 'ADI', arr: '05:30:00', dep: null, dist: 934, plat: 1 }
                ]
            },
            {
                number: '12915',
                name: 'Ashram Express (ADI - DLI)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'ADI', arr: null, dep: '19:15:00', dist: 0, plat: 1 },
                    { code: 'ABR', arr: '22:30:00', dep: '22:40:00', dist: 186, plat: 1 },
                    { code: 'AII', arr: '02:25:00', dep: '02:35:00', dist: 491, plat: 1 },
                    { code: 'JP', arr: '04:20:00', dep: '04:30:00', dist: 626, plat: 1 },
                    { code: 'DEC', arr: '09:20:00', dep: '09:22:00', dist: 920, plat: 3 },
                    { code: 'DLI', arr: '10:00:00', dep: null, dist: 934, plat: 3 }
                ]
            },

            // Chetak Express (Delhi - Jaipur - Udaipur)
            {
                number: '20473',
                name: 'Chetak Superfast Express (DEE - UDZ)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DEC', arr: null, dep: '19:50:00', dist: 0, plat: 1 },
                    { code: 'JP', arr: '00:15:00', dep: '00:25:00', dist: 300, plat: 2 },
                    { code: 'AII', arr: '02:35:00', dep: '02:45:00', dist: 435, plat: 3 },
                    { code: 'UDZ', arr: '07:50:00', dep: null, dist: 735, plat: 1 }
                ]
            },
            {
                number: '20474',
                name: 'Chetak Superfast Express (UDZ - DEE)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'UDZ', arr: null, dep: '17:00:00', dist: 0, plat: 1 },
                    { code: 'AII', arr: '22:15:00', dep: '22:25:00', dist: 300, plat: 1 },
                    { code: 'JP', arr: '00:15:00', dep: '00:25:00', dist: 435, plat: 2 },
                    { code: 'DEC', arr: '05:05:00', dep: null, dist: 735, plat: 1 }
                ]
            },

            // Poorva Express (Delhi - Patna - Howrah)
            {
                number: '12304',
                name: 'Poorva Express (NDLS - HWH via Patna)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '17:40:00', dist: 0, plat: 15 },
                    { code: 'ALJN', arr: '19:13:00', dep: '19:15:00', dist: 131, plat: 3 },
                    { code: 'CNB', arr: '22:55:00', dep: '23:05:00', dist: 440, plat: 1 },
                    { code: 'PRYJ', arr: '01:15:00', dep: '01:20:00', dist: 635, plat: 4 },
                    { code: 'MGS', arr: '03:50:00', dep: '04:00:00', dist: 787, plat: 2 },
                    { code: 'PNBE', arr: '06:50:00', dep: '07:00:00', dist: 999, plat: 1 },
                    { code: 'ASN', arr: '12:55:00', dep: '13:00:00', dist: 1330, plat: 5 },
                    { code: 'BWN', arr: '14:28:00', dep: '14:33:00', dist: 1436, plat: 5 },
                    { code: 'HWH', arr: '17:00:00', dep: null, dist: 1531, plat: 8 }
                ]
            },
            {
                number: '12303',
                name: 'Poorva Express (HWH - NDLS via Patna)',
                type: 'Superfast',
                total_seats: 1950,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '08:00:00', dist: 0, plat: 8 },
                    { code: 'BWN', arr: '09:05:00', dep: '09:08:00', dist: 95, plat: 1 },
                    { code: 'ASN', arr: '10:32:00', dep: '10:37:00', dist: 201, plat: 4 },
                    { code: 'PNBE', arr: '16:00:00', dep: '16:10:00', dist: 532, plat: 1 },
                    { code: 'MGS', arr: '19:30:00', dep: '19:40:00', dist: 744, plat: 2 },
                    { code: 'PRYJ', arr: '21:40:00', dep: '21:45:00', dist: 896, plat: 1 },
                    { code: 'CNB', arr: '00:02:00', dep: '00:07:00', dist: 1091, plat: 1 },
                    { code: 'ALJN', arr: '03:18:00', dep: '03:20:00', dist: 1400, plat: 2 },
                    { code: 'NDLS', arr: '06:00:00', dep: null, dist: 1531, plat: 15 }
                ]
            },

            // Lucknow Mail (Delhi - Lucknow Charbagh)
            {
                number: '12230',
                name: 'Lucknow Mail (NDLS - LKO)',
                type: 'Mail',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '22:00:00', dist: 0, plat: 16 },
                    { code: 'GZB', arr: '22:43:00', dep: '22:45:00', dist: 26, plat: 1 },
                    { code: 'MB', arr: '01:05:00', dep: '01:13:00', dist: 167, plat: 1 },
                    { code: 'BE', arr: '02:37:00', dep: '02:42:00', dist: 258, plat: 1 },
                    { code: 'LKO', arr: '06:50:00', dep: null, dist: 493, plat: 2 }
                ]
            },
            {
                number: '12229',
                name: 'Lucknow Mail (LKO - NDLS)',
                type: 'Mail',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'LKO', arr: null, dep: '22:00:00', dist: 0, plat: 2 },
                    { code: 'BE', arr: '01:52:00', dep: '01:57:00', dist: 235, plat: 2 },
                    { code: 'MB', arr: '03:25:00', dep: '03:33:00', dist: 326, plat: 2 },
                    { code: 'GZB', arr: '05:58:00', dep: '06:00:00', dist: 467, plat: 3 },
                    { code: 'NDLS', arr: '06:55:00', dep: null, dist: 493, plat: 16 }
                ]
            },

            // Kashi Vishwanath Express (Delhi - Varanasi)
            {
                number: '15128',
                name: 'Kashi Vishwanath Express (NDLS - BSBS)',
                type: 'Express',
                total_seats: 1800,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '11:35:00', dist: 0, plat: 8 },
                    { code: 'GZB', arr: '12:15:00', dep: '12:17:00', dist: 26, plat: 2 },
                    { code: 'MB', arr: '14:50:00', dep: '14:58:00', dist: 167, plat: 1 },
                    { code: 'BE', arr: '16:43:00', dep: '16:45:00', dist: 258, plat: 1 },
                    { code: 'LKO', arr: '21:05:00', dep: '21:15:00', dist: 493, plat: 1 },
                    { code: 'PRYJ', arr: '01:55:00', dep: '02:00:00', dist: 700, plat: 1 },
                    { code: 'BSBS', arr: '04:40:00', dep: null, dist: 792, plat: 1 }
                ]
            },
            {
                number: '15127',
                name: 'Kashi Vishwanath Express (BSBS - NDLS)',
                type: 'Express',
                total_seats: 1800,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BSBS', arr: null, dep: '13:30:00', dist: 0, plat: 1 },
                    { code: 'PRYJ', arr: '16:05:00', dep: '16:10:00', dist: 92, plat: 1 },
                    { code: 'LKO', arr: '20:10:00', dep: '20:20:00', dist: 299, plat: 2 },
                    { code: 'BE', arr: '00:13:00', dep: '00:15:00', dist: 534, plat: 2 },
                    { code: 'MB', arr: '01:57:00', dep: '02:05:00', dist: 625, plat: 2 },
                    { code: 'GZB', arr: '04:40:00', dep: '04:42:00', dist: 766, plat: 3 },
                    { code: 'NDLS', arr: '05:40:00', dep: null, dist: 792, plat: 8 }
                ]
            },

            // Malwa Express (Katra - Jammu - Delhi - Indore)
            {
                number: '12920',
                name: 'Malwa Superfast Express (SVDK - INDB)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SVDK', arr: null, dep: '08:35:00', dist: 0, plat: 1 },
                    { code: 'JAT', arr: '10:00:00', dep: '10:10:00', dist: 78, plat: 2 },
                    { code: 'LDH', arr: '15:10:00', dep: '15:20:00', dist: 343, plat: 1 },
                    { code: 'UMB', arr: '17:00:00', dep: '17:10:00', dist: 457, plat: 6 },
                    { code: 'NDLS', arr: '20:15:00', dep: '20:30:00', dist: 655, plat: 7 },
                    { code: 'MTJ', arr: '22:38:00', dep: '22:40:00', dist: 796, plat: 2 },
                    { code: 'AGC', arr: '23:15:00', dep: '23:20:00', dist: 850, plat: 1 },
                    { code: 'GWL', arr: '01:21:00', dep: '01:23:00', dist: 968, plat: 1 },
                    { code: 'JHS', arr: '02:55:00', dep: '03:05:00', dist: 1065, plat: 2 },
                    { code: 'BPL', arr: '07:25:00', dep: '07:30:00', dist: 1357, plat: 1 },
                    { code: 'UJN', arr: '11:20:00', dep: '11:35:00', dist: 1540, plat: 1 },
                    { code: 'INDB', arr: '13:50:00', dep: null, dist: 1619, plat: 4 }
                ]
            },
            {
                number: '12919',
                name: 'Malwa Superfast Express (INDB - SVDK)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'INDB', arr: null, dep: '12:15:00', dist: 0, plat: 4 },
                    { code: 'UJN', arr: '13:50:00', dep: '14:00:00', dist: 79, plat: 2 },
                    { code: 'BPL', arr: '17:25:00', dep: '17:30:00', dist: 262, plat: 2 },
                    { code: 'JHS', arr: '21:30:00', dep: '21:38:00', dist: 554, plat: 1 },
                    { code: 'GWL', arr: '22:52:00', dep: '22:54:00', dist: 651, plat: 2 },
                    { code: 'AGC', arr: '00:45:00', dep: '00:50:00', dist: 769, plat: 2 },
                    { code: 'MTJ', arr: '01:23:00', dep: '01:25:00', dist: 823, plat: 3 },
                    { code: 'NDLS', arr: '04:15:00', dep: '04:30:00', dist: 964, plat: 7 },
                    { code: 'UMB', arr: '07:35:00', dep: '07:42:00', dist: 1162, plat: 7 },
                    { code: 'LDH', arr: '09:40:00', dep: '09:50:00', dist: 1276, plat: 2 },
                    { code: 'JAT', arr: '14:10:00', dep: '14:15:00', dist: 1541, plat: 1 },
                    { code: 'SVDK', arr: '16:05:00', dep: null, dist: 1619, plat: 1 }
                ]
            },

            // Charminar Express (Hyderabad - Chennai)
            {
                number: '12760',
                name: 'Charminar Express (HYB - MAS)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HYB', arr: null, dep: '18:00:00', dist: 0, plat: 5 },
                    { code: 'SC', arr: '18:20:00', dep: '18:25:00', dist: 9, plat: 1 },
                    { code: 'KZJ', arr: '20:18:00', dep: '20:20:00', dist: 141, plat: 1 },
                    { code: 'WL', arr: '20:33:00', dep: '20:35:00', dist: 151, plat: 1 },
                    { code: 'BZA', arr: '00:05:00', dep: '00:15:00', dist: 358, plat: 1 },
                    { code: 'OGL', arr: '02:08:00', dep: '02:10:00', dist: 497, plat: 3 },
                    { code: 'NLR', arr: '03:38:00', dep: '03:40:00', dist: 613, plat: 3 },
                    { code: 'MAS', arr: '08:00:00', dep: null, dist: 790, plat: 8 }
                ]
            },
            {
                number: '12759',
                name: 'Charminar Express (MAS - HYB)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '18:20:00', dist: 0, plat: 8 },
                    { code: 'NLR', arr: '21:03:00', dep: '21:05:00', dist: 177, plat: 2 },
                    { code: 'OGL', arr: '22:33:00', dep: '22:35:00', dist: 293, plat: 1 },
                    { code: 'BZA', arr: '01:10:00', dep: '01:20:00', dist: 432, plat: 6 },
                    { code: 'WL', arr: '04:18:00', dep: '04:20:00', dist: 639, plat: 2 },
                    { code: 'KZJ', arr: '04:38:00', dep: '04:40:00', dist: 649, plat: 2 },
                    { code: 'SC', arr: '07:05:00', dep: '07:10:00', dist: 781, plat: 2 },
                    { code: 'HYB', arr: '08:10:00', dep: null, dist: 790, plat: 5 }
                ]
            },

            // Saraighat Express (Howrah - Guwahati)
            {
                number: '12345',
                name: 'Saraighat Superfast Express (HWH - GHY)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '16:05:00', dist: 0, plat: 9 },
                    { code: 'BWN', arr: '17:12:00', dep: '17:15:00', dist: 95, plat: 1 },
                    { code: 'MLDT', arr: '21:30:00', dep: '21:40:00', dist: 334, plat: 1 },
                    { code: 'NJP', arr: '01:25:00', dep: '01:35:00', dist: 569, plat: 1 },
                    { code: 'KYQ', arr: '09:43:00', dep: '09:45:00', dist: 992, plat: 2 },
                    { code: 'GHY', arr: '10:05:00', dep: null, dist: 999, plat: 1 }
                ]
            },
            {
                number: '12346',
                name: 'Saraighat Superfast Express (GHY - HWH)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'GHY', arr: null, dep: '12:20:00', dist: 0, plat: 1 },
                    { code: 'KYQ', arr: '12:35:00', dep: '12:37:00', dist: 7, plat: 1 },
                    { code: 'NJP', arr: '19:35:00', dep: '19:45:00', dist: 430, plat: 2 },
                    { code: 'MLDT', arr: '23:30:00', dep: '23:40:00', dist: 665, plat: 1 },
                    { code: 'BWN', arr: '03:38:00', dep: '03:40:00', dist: 904, plat: 5 },
                    { code: 'HWH', arr: '05:15:00', dep: null, dist: 999, plat: 9 }
                ]
            },

            // Netaji Express / Kalka Mail (Howrah - Delhi - Kalka)
            {
                number: '12311',
                name: 'Netaji Express (HWH - KLK via NDLS)',
                type: 'Mail',
                total_seats: 1950,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HWH', arr: null, dep: '21:55:00', dist: 0, plat: 8 },
                    { code: 'ASN', arr: '00:30:00', dep: '00:35:00', dist: 200, plat: 4 },
                    { code: 'DHN', arr: '01:45:00', dep: '01:50:00', dist: 259, plat: 1 },
                    { code: 'GAYA', arr: '05:15:00', dep: '05:20:00', dist: 458, plat: 1 },
                    { code: 'MGS', arr: '08:05:00', dep: '08:15:00', dist: 663, plat: 2 },
                    { code: 'PRYJ', arr: '10:40:00', dep: '10:50:00', dist: 816, plat: 1 },
                    { code: 'CNB', arr: '13:30:00', dep: '13:40:00', dist: 1010, plat: 1 },
                    { code: 'ALJN', arr: '17:40:00', dep: '17:45:00', dist: 1319, plat: 2 },
                    { code: 'DLI', arr: '20:55:00', dep: '21:25:00', dist: 1445, plat: 5 },
                    { code: 'PNP', arr: '22:45:00', dep: '22:47:00', dist: 1534, plat: 3 },
                    { code: 'UMB', arr: '00:45:00', dep: '00:55:00', dist: 1643, plat: 6 },
                    { code: 'CDG', arr: '01:35:00', dep: '01:45:00', dist: 1688, plat: 1 },
                    { code: 'KLK', arr: '03:00:00', dep: null, dist: 1725, plat: 1 }
                ]
            },
            {
                number: '12312',
                name: 'Netaji Express (KLK - HWH via DLI)',
                type: 'Mail',
                total_seats: 1950,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'KLK', arr: null, dep: '23:55:00', dist: 0, plat: 1 },
                    { code: 'CDG', arr: '00:30:00', dep: '00:40:00', dist: 37, plat: 2 },
                    { code: 'UMB', arr: '01:25:00', dep: '01:35:00', dist: 82, plat: 7 },
                    { code: 'PNP', arr: '02:50:00', dep: '02:52:00', dist: 191, plat: 2 },
                    { code: 'DLI', arr: '05:55:00', dep: '06:15:00', dist: 280, plat: 5 },
                    { code: 'ALJN', arr: '08:30:00', dep: '08:35:00', dist: 406, plat: 3 },
                    { code: 'CNB', arr: '13:45:00', dep: '13:55:00', dist: 715, plat: 1 },
                    { code: 'PRYJ', arr: '17:05:00', dep: '17:15:00', dist: 909, plat: 4 },
                    { code: 'MGS', arr: '20:30:00', dep: '20:40:00', dist: 1062, plat: 2 },
                    { code: 'GAYA', arr: '23:35:00', dep: '23:40:00', dist: 1267, plat: 1 },
                    { code: 'DHN', arr: '03:15:00', dep: '03:20:00', dist: 1466, plat: 1 },
                    { code: 'ASN', arr: '04:30:00', dep: '04:35:00', dist: 1525, plat: 5 },
                    { code: 'HWH', arr: '07:30:00', dep: null, dist: 1725, plat: 8 }
                ]
            },

            // Vaigai Superfast Express (Chennai - Madurai)
            {
                number: '12635',
                name: 'Vaigai Superfast Express (MS - MDU)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 850, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'MS', arr: null, dep: '13:50:00', dist: 0, plat: 4 },
                    { code: 'TBM', arr: '14:18:00', dep: '14:20:00', dist: 25, plat: 8 },
                    { code: 'TPJ', arr: '19:45:00', dep: '19:50:00', dist: 336, plat: 1 },
                    { code: 'MDU', arr: '21:30:00', dep: null, dist: 497, plat: 2 }
                ]
            },
            {
                number: '12636',
                name: 'Vaigai Superfast Express (MDU - MS)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 850, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'MDU', arr: null, dep: '07:10:00', dist: 0, plat: 2 },
                    { code: 'TPJ', arr: '09:00:00', dep: '09:05:00', dist: 161, plat: 3 },
                    { code: 'TBM', arr: '13:58:00', dep: '14:00:00', dist: 472, plat: 5 },
                    { code: 'MS', arr: '14:40:00', dep: null, dist: 497, plat: 4 }
                ]
            },

            // Kovai Express (Chennai - Coimbatore)
            {
                number: '12675',
                name: 'Kovai Superfast Express (MAS - CBE)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 850, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'MAS', arr: null, dep: '06:10:00', dist: 0, plat: 10 },
                    { code: 'SA', arr: '10:48:00', dep: '10:50:00', dist: 334, plat: 4 },
                    { code: 'ED', arr: '11:45:00', dep: '11:50:00', dist: 396, plat: 2 },
                    { code: 'CBE', arr: '14:05:00', dep: null, dist: 496, plat: 3 }
                ]
            },
            {
                number: '12676',
                name: 'Kovai Superfast Express (CBE - MAS)',
                type: 'Superfast',
                total_seats: 1450,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 },
                    { code: '2S', name: 'Second Sitting', seats: 850, fare_per_km: 0.38 }
                ],
                stops: [
                    { code: 'CBE', arr: null, dep: '15:15:00', dist: 0, plat: 3 },
                    { code: 'ED', arr: '16:45:00', dep: '16:50:00', dist: 100, plat: 1 },
                    { code: 'SA', arr: '17:43:00', dep: '17:45:00', dist: 162, plat: 1 },
                    { code: 'MAS', arr: '22:50:00', dep: null, dist: 496, plat: 10 }
                ]
            },

            // Udyan Express (Mumbai - Pune - Bengaluru)
            {
                number: '11301',
                name: 'Udyan Express (CSMT - SBC)',
                type: 'Express',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '08:10:00', dist: 0, plat: 17 },
                    { code: 'KYN', arr: '09:02:00', dep: '09:05:00', dist: 54, plat: 5 },
                    { code: 'PNQ', arr: '11:40:00', dep: '11:45:00', dist: 192, plat: 1 },
                    { code: 'SUR', arr: '15:45:00', dep: '15:50:00', dist: 455, plat: 1 },
                    { code: 'KLBG', arr: '17:35:00', dep: '17:40:00', dist: 568, plat: 2 },
                    { code: 'SBC', arr: '06:00:00', dep: null, dist: 1153, plat: 3 }
                ]
            },
            {
                number: '11302',
                name: 'Udyan Express (SBC - CSMT)',
                type: 'Express',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SBC', arr: null, dep: '20:45:00', dist: 0, plat: 3 },
                    { code: 'KLBG', arr: '08:15:00', dep: '08:20:00', dist: 585, plat: 1 },
                    { code: 'SUR', arr: '10:50:00', dep: '10:55:00', dist: 698, plat: 3 },
                    { code: 'PNQ', arr: '16:00:00', dep: '16:05:00', dist: 961, plat: 3 },
                    { code: 'KYN', arr: '18:52:00', dep: '18:55:00', dist: 1099, plat: 7 },
                    { code: 'CSMT', arr: '20:15:00', dep: null, dist: 1153, plat: 17 }
                ]
            },

            // Goa Express (Delhi - Agra - Bhopal - Pune - Goa)
            {
                number: '12780',
                name: 'Goa Superfast Express (NZM - MAO)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NZM', arr: null, dep: '15:15:00', dist: 0, plat: 7 },
                    { code: 'MTJ', arr: '16:45:00', dep: '16:47:00', dist: 134, plat: 1 },
                    { code: 'AGC', arr: '17:50:00', dep: '17:55:00', dist: 188, plat: 1 },
                    { code: 'GWL', arr: '19:40:00', dep: '19:42:00', dist: 306, plat: 1 },
                    { code: 'JHS', arr: '21:10:00', dep: '21:20:00', dist: 403, plat: 2 },
                    { code: 'BPL', arr: '01:00:00', dep: '01:05:00', dist: 695, plat: 1 },
                    { code: 'ET', arr: '02:40:00', dep: '02:45:00', dist: 787, plat: 2 },
                    { code: 'BSL', arr: '06:55:00', dep: '07:00:00', dist: 1094, plat: 3 },
                    { code: 'MMR', arr: '09:20:00', dep: '09:25:00', dist: 1278, plat: 4 },
                    { code: 'PNQ', arr: '16:55:00', dep: '17:10:00', dist: 1586, plat: 2 },
                    { code: 'MAO', arr: '06:30:00', dep: null, dist: 2164, plat: 1 }
                ]
            },
            {
                number: '12779',
                name: 'Goa Superfast Express (MAO - NZM)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MAO', arr: null, dep: '15:10:00', dist: 0, plat: 1 },
                    { code: 'PNQ', arr: '04:15:00', dep: '04:30:00', dist: 578, plat: 1 },
                    { code: 'MMR', arr: '11:15:00', dep: '11:20:00', dist: 886, plat: 1 },
                    { code: 'BSL', arr: '13:40:00', dep: '13:45:00', dist: 1070, plat: 6 },
                    { code: 'ET', arr: '18:10:00', dep: '18:15:00', dist: 1377, plat: 1 },
                    { code: 'BPL', arr: '19:40:00', dep: '19:45:00', dist: 1469, plat: 2 },
                    { code: 'JHS', arr: '23:45:00', dep: '23:55:00', dist: 1761, plat: 1 },
                    { code: 'GWL', arr: '01:05:00', dep: '01:07:00', dist: 1858, plat: 2 },
                    { code: 'AGC', arr: '03:15:00', dep: '03:20:00', dist: 1976, plat: 2 },
                    { code: 'MTJ', arr: '04:00:00', dep: '04:02:00', dist: 2030, plat: 3 },
                    { code: 'NZM', arr: '06:25:00', dep: null, dist: 2164, plat: 7 }
                ]
            },

            // Marudhar Express (Varanasi - Lucknow - Agra - Jaipur - Jodhpur)
            {
                number: '14853',
                name: 'Marudhar Express (BSB - JU via AGC)',
                type: 'Express',
                total_seats: 1700,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BSB', arr: null, dep: '17:00:00', dist: 0, plat: 7 },
                    { code: 'LKO', arr: '00:05:00', dep: '00:15:00', dist: 300, plat: 4 },
                    { code: 'CNB', arr: '01:50:00', dep: '01:55:00', dist: 372, plat: 1 },
                    { code: 'AF', arr: '06:25:00', dep: '06:35:00', dist: 601, plat: 3 },
                    { code: 'AGC', arr: '06:50:00', dep: '06:55:00', dist: 605, plat: 1 },
                    { code: 'JP', arr: '11:45:00', dep: '11:55:00', dist: 846, plat: 2 },
                    { code: 'JU', arr: '17:45:00', dep: null, dist: 1156, plat: 1 }
                ]
            },
            {
                number: '14854',
                name: 'Marudhar Express (JU - BSB via AGC)',
                type: 'Express',
                total_seats: 1700,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'JU', arr: null, dep: '08:20:00', dist: 0, plat: 1 },
                    { code: 'JP', arr: '13:50:00', dep: '14:00:00', dist: 310, plat: 1 },
                    { code: 'AGC', arr: '18:50:00', dep: '18:55:00', dist: 551, plat: 2 },
                    { code: 'AF', arr: '19:15:00', dep: '19:25:00', dist: 555, plat: 1 },
                    { code: 'CNB', arr: '00:10:00', dep: '00:15:00', dist: 784, plat: 1 },
                    { code: 'LKO', arr: '01:50:00', dep: '02:00:00', dist: 856, plat: 1 },
                    { code: 'BSB', arr: '09:30:00', dep: null, dist: 1156, plat: 7 }
                ]
            },

            // Himsagar Express (Katra to Kanyakumari - India's legendary trans-national route)
            {
                number: '16318',
                name: 'Himsagar Express (SVDK - CAPE)',
                type: 'Express',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.7 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.8 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.42 }
                ],
                stops: [
                    { code: 'SVDK', arr: null, dep: '22:30:00', dist: 0, plat: 1 },
                    { code: 'JAT', arr: '00:05:00', dep: '00:15:00', dist: 78, plat: 1 },
                    { code: 'LDH', arr: '05:40:00', dep: '05:50:00', dist: 343, plat: 1 },
                    { code: 'UMB', arr: '08:00:00', dep: '08:10:00', dist: 457, plat: 7 },
                    { code: 'NDLS', arr: '13:50:00', dep: '14:15:00', dist: 655, plat: 4 },
                    { code: 'AGC', arr: '16:50:00', dep: '16:55:00', dist: 850, plat: 1 },
                    { code: 'GWL', arr: '18:48:00', dep: '18:50:00', dist: 968, plat: 1 },
                    { code: 'JHS', arr: '20:15:00', dep: '20:25:00', dist: 1065, plat: 2 },
                    { code: 'BPL', arr: '01:55:00', dep: '02:00:00', dist: 1357, plat: 1 },
                    { code: 'NGP', arr: '09:00:00', dep: '09:05:00', dist: 1747, plat: 2 },
                    { code: 'WL', arr: '15:20:00', dep: '15:25:00', dist: 2190, plat: 1 },
                    { code: 'BZA', arr: '19:40:00', dep: '19:50:00', dist: 2397, plat: 6 },
                    { code: 'RU', arr: '02:45:00', dep: '02:50:00', dist: 2773, plat: 1 },
                    { code: 'SA', arr: '08:48:00', dep: '08:50:00', dist: 3100, plat: 1 },
                    { code: 'ED', arr: '09:50:00', dep: '09:55:00', dist: 3160, plat: 2 },
                    { code: 'CBE', arr: '11:27:00', dep: '11:30:00', dist: 3260, plat: 1 },
                    { code: 'PGT', arr: '12:50:00', dep: '12:55:00', dist: 3316, plat: 2 },
                    { code: 'TCR', arr: '14:32:00', dep: '14:35:00', dist: 3392, plat: 1 },
                    { code: 'ERN', arr: '16:05:00', dep: '16:10:00', dist: 3466, plat: 2 },
                    { code: 'KTYM', arr: '17:22:00', dep: '17:25:00', dist: 3526, plat: 1 },
                    { code: 'QLN', arr: '19:22:00', dep: '19:25:00', dist: 3621, plat: 1 },
                    { code: 'TVC', arr: '21:00:00', dep: '21:05:00', dist: 3686, plat: 1 },
                    { code: 'CAPE', arr: '23:20:00', dep: null, dist: 3773, plat: 1 }
                ]
            },

            // Kasaragod - Trivandrum Vande Bharat (Kerala Spine)
            {
                number: '20631',
                name: 'Kasaragod - Thiruvananthapuram Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'CAN', arr: null, dep: '07:00:00', dist: 0, plat: 1 },
                    { code: 'CLT', arr: '08:03:00', dep: '08:05:00', dist: 89, plat: 3 },
                    { code: 'TCR', arr: '09:32:00', dep: '09:34:00', dist: 208, plat: 1 },
                    { code: 'ERN', arr: '10:35:00', dep: '10:38:00', dist: 282, plat: 2 },
                    { code: 'ALLP', arr: '11:34:00', dep: '11:36:00', dist: 339, plat: 1 },
                    { code: 'QLN', arr: '12:30:00', dep: '12:32:00', dist: 424, plat: 1 },
                    { code: 'TVC', arr: '13:25:00', dep: null, dist: 489, plat: 1 }
                ]
            },
            {
                number: '20632',
                name: 'Thiruvananthapuram - Kasaragod Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'TVC', arr: null, dep: '16:05:00', dist: 0, plat: 1 },
                    { code: 'QLN', arr: '16:53:00', dep: '16:55:00', dist: 65, plat: 2 },
                    { code: 'ALLP', arr: '17:55:00', dep: '17:57:00', dist: 150, plat: 1 },
                    { code: 'ERN', arr: '18:50:00', dep: '18:53:00', dist: 207, plat: 1 },
                    { code: 'TCR', arr: '19:53:00', dep: '19:55:00', dist: 281, plat: 2 },
                    { code: 'CLT', arr: '21:17:00', dep: '21:19:00', dist: 400, plat: 4 },
                    { code: 'CAN', arr: '22:40:00', dep: null, dist: 489, plat: 2 }
                ]
            },

            // Secunderabad - Visakhapatnam Vande Bharat
            {
                number: '20834',
                name: 'Secunderabad - Visakhapatnam Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'SC', arr: null, dep: '15:00:00', dist: 0, plat: 10 },
                    { code: 'WL', arr: '16:35:00', dep: '16:37:00', dist: 142, plat: 1 },
                    { code: 'BZA', arr: '19:00:00', dep: '19:05:00', dist: 349, plat: 1 },
                    { code: 'RJY', arr: '20:58:00', dep: '21:00:00', dist: 499, plat: 1 },
                    { code: 'VSKP', arr: '23:30:00', dep: null, dist: 699, plat: 1 }
                ]
            },
            {
                number: '20833',
                name: 'Visakhapatnam - Secunderabad Vande Bharat Express',
                type: 'Vande Bharat',
                total_seats: 1128,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 52, fare_per_km: 3.7 },
                    { code: 'CC', name: 'AC Chair Car', seats: 240, fare_per_km: 2.05 }
                ],
                stops: [
                    { code: 'VSKP', arr: null, dep: '05:45:00', dist: 0, plat: 1 },
                    { code: 'RJY', arr: '07:55:00', dep: '07:57:00', dist: 200, plat: 3 },
                    { code: 'BZA', arr: '10:00:00', dep: '10:05:00', dist: 350, plat: 6 },
                    { code: 'WL', arr: '12:05:00', dep: '12:07:00', dist: 557, plat: 2 },
                    { code: 'SC', arr: '14:15:00', dep: null, dist: 699, plat: 10 }
                ]
            }
        ];

        let insertedTrains = 0;
        let insertedRoutes = 0;

        for (const t of trains) {
            // Check if train already exists
            const [existing] = await connection.query('SELECT train_id FROM trains WHERE train_number = ?', [t.number]);
            let trainId;

            if (existing.length > 0) {
                trainId = existing[0].train_id;
                // Update basic train properties
                await connection.query(
                    'UPDATE trains SET train_name = ?, train_type = ?, total_seats = ?, status = ? WHERE train_id = ?',
                    [t.name, t.type, t.total_seats, 'Active', trainId]
                );
            } else {
                const [res] = await connection.query(
                    'INSERT INTO trains (train_number, train_name, train_type, total_seats, status) VALUES (?, ?, ?, ?, ?)',
                    [t.number, t.name, t.type, t.total_seats, 'Active']
                );
                trainId = res.insertId;
                insertedTrains++;
            }

            // Train schedule
            await connection.query(
                `INSERT INTO train_schedule (train_id, runs_on_mon, runs_on_tue, runs_on_wed, runs_on_thu, runs_on_fri, runs_on_sat, runs_on_sun)
                 VALUES (?, 1, 1, 1, 1, 1, 1, 1)
                 ON DUPLICATE KEY UPDATE runs_on_mon=1, runs_on_tue=1, runs_on_wed=1, runs_on_thu=1, runs_on_fri=1, runs_on_sat=1, runs_on_sun=1`,
                [trainId]
            );

            // Classes - Upsert without deleting to preserve foreign key constraints
            for (const cls of t.classes) {
                const [existingCls] = await connection.query(
                    'SELECT class_id FROM train_classes WHERE train_id = ? AND class_code = ?',
                    [trainId, cls.code]
                );
                if (existingCls.length > 0) {
                    await connection.query(
                        'UPDATE train_classes SET class_name = ?, total_seats = ?, fare_per_km = ? WHERE class_id = ?',
                        [cls.name, cls.seats, cls.fare_per_km, existingCls[0].class_id]
                    );
                } else {
                    await connection.query(
                        'INSERT INTO train_classes (train_id, class_code, class_name, total_seats, fare_per_km) VALUES (?, ?, ?, ?, ?)',
                        [trainId, cls.code, cls.name, cls.seats, cls.fare_per_km]
                    );
                }
            }

            // Routes
            await connection.query('DELETE FROM routes WHERE train_id = ?', [trainId]);
            const validStops = getStops(t.stops);
            for (let i = 0; i < validStops.length; i++) {
                const s = validStops[i];
                const stationId = smap[s.code];
                await connection.query(
                    'INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [trainId, stationId, i + 1, s.arr, s.dep, s.dist, s.plat || 1]
                );
                insertedRoutes++;
            }
        }

        await connection.commit();
        console.log(`✅ Success! Seeded/Updated trains. Total inserted routes: ${insertedRoutes}`);
    } catch (err) {
        await connection.rollback();
        console.error('❌ Seeding failed:', err);
    } finally {
        connection.release();
    }
}

seedAllIndianTrains().then(() => {
    console.log('Seeding process finished.');
    process.exit(0);
});
