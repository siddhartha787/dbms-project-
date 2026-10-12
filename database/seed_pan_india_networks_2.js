// =======================================================================
// Pan-India Train Network Seeder Part 2: Complete 100% Station Coverage
// Seeds 40+ Additional Express Trains Ensuring ALL 188 Stations are connected
// =======================================================================

const db = require('./db');

async function seedPart2() {
    console.log('🚀 Seeding comprehensive train routes for remaining stations...');

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [stations] = await connection.query('SELECT station_id, station_code FROM stations');
        const smap = {};
        stations.forEach(s => smap[s.code = s.station_code] = s.station_id);

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
            // 1. Dehradun Shatabdi & Vande Bharat (Delhi - Haridwar - Dehradun)
            {
                number: '12017',
                name: 'Dehradun Shatabdi Express (NDLS - DDN)',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '06:45:00', dist: 0, plat: 1 },
                    { code: 'GZB', arr: '07:21:00', dep: '07:23:00', dist: 26, plat: 1 },
                    { code: 'MTC', arr: '07:55:00', dep: '07:57:00', dist: 70, plat: 1 },
                    { code: 'SRE', arr: '09:40:00', dep: '09:45:00', dist: 184, plat: 3 },
                    { code: 'HW', arr: '11:28:00', dep: '11:33:00', dist: 259, plat: 2 },
                    { code: 'DDN', arr: '12:55:00', dep: null, dist: 311, plat: 1 }
                ]
            },
            {
                number: '12018',
                name: 'Dehradun Shatabdi Express (DDN - NDLS)',
                type: 'Shatabdi',
                total_seats: 1200,
                classes: [
                    { code: 'EC', name: 'Executive Chair Car', seats: 46, fare_per_km: 3.5 },
                    { code: 'CC', name: 'AC Chair Car', seats: 280, fare_per_km: 1.9 }
                ],
                stops: [
                    { code: 'DDN', arr: null, dep: '17:00:00', dist: 0, plat: 1 },
                    { code: 'HW', arr: '18:12:00', dep: '18:17:00', dist: 52, plat: 1 },
                    { code: 'SRE', arr: '20:00:00', dep: '20:05:00', dist: 127, plat: 4 },
                    { code: 'MTC', arr: '21:35:00', dep: '21:37:00', dist: 241, plat: 2 },
                    { code: 'GZB', arr: '22:15:00', dep: '22:17:00', dist: 285, plat: 2 },
                    { code: 'NDLS', arr: '22:50:00', dep: null, dist: 311, plat: 1 }
                ]
            },

            // 2. Gorakhdham Superfast (Delhi - Lucknow - Gorakhpur)
            {
                number: '12556',
                name: 'Gorakhdham Superfast Express (NDLS - GKP)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '21:25:00', dist: 0, plat: 6 },
                    { code: 'CNB', arr: '02:55:00', dep: '03:00:00', dist: 440, plat: 1 },
                    { code: 'LKO', arr: '04:50:00', dep: '05:00:00', dist: 512, plat: 3 },
                    { code: 'GKP', arr: '09:45:00', dep: null, dist: 782, plat: 1 }
                ]
            },
            {
                number: '12555',
                name: 'Gorakhdham Superfast Express (GKP - NDLS)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'GKP', arr: null, dep: '16:35:00', dist: 0, plat: 1 },
                    { code: 'LKO', arr: '21:20:00', dep: '21:30:00', dist: 270, plat: 4 },
                    { code: 'CNB', arr: '23:18:00', dep: '23:23:00', dist: 342, plat: 2 },
                    { code: 'NDLS', arr: '05:15:00', dep: null, dist: 782, plat: 6 }
                ]
            },

            // 3. Vaishali Superfast (Delhi - Gorakhpur - Muzaffarpur - Barauni)
            {
                number: '12554',
                name: 'Vaishali Superfast Express (NDLS - BJU)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '20:40:00', dist: 0, plat: 8 },
                    { code: 'GZB', arr: '21:23:00', dep: '21:25:00', dist: 26, plat: 2 },
                    { code: 'ALJN', arr: '22:33:00', dep: '22:35:00', dist: 131, plat: 3 },
                    { code: 'CNB', arr: '02:25:00', dep: '02:30:00', dist: 440, plat: 1 },
                    { code: 'LKO', arr: '04:05:00', dep: '04:15:00', dist: 512, plat: 2 },
                    { code: 'GKP', arr: '09:20:00', dep: '09:30:00', dist: 782, plat: 2 },
                    { code: 'MFP', arr: '13:50:00', dep: '13:55:00', dist: 1042, plat: 1 },
                    { code: 'BJU', arr: '15:55:00', dep: null, dist: 1129, plat: 3 }
                ]
            },
            {
                number: '12553',
                name: 'Vaishali Superfast Express (BJU - NDLS)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BJU', arr: null, dep: '12:05:00', dist: 0, plat: 3 },
                    { code: 'MFP', arr: '13:55:00', dep: '14:00:00', dist: 87, plat: 2 },
                    { code: 'GKP', arr: '18:15:00', dep: '18:25:00', dist: 347, plat: 1 },
                    { code: 'LKO', arr: '23:35:00', dep: '23:45:00', dist: 617, plat: 1 },
                    { code: 'CNB', arr: '01:20:00', dep: '01:25:00', dist: 689, plat: 3 },
                    { code: 'ALJN', arr: '04:58:00', dep: '05:00:00', dist: 998, plat: 2 },
                    { code: 'GZB', arr: '06:18:00', dep: '06:20:00', dist: 1103, plat: 3 },
                    { code: 'NDLS', arr: '07:00:00', dep: null, dist: 1129, plat: 8 }
                ]
            },

            // 4. Bihar Sampark Kranti (Delhi - Darbhanga via Kanpur, Lucknow, Gorakhpur, Muzaffarpur)
            {
                number: '12566',
                name: 'Bihar Sampark Kranti Superfast (NDLS - DBG)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '13:00:00', dist: 0, plat: 14 },
                    { code: 'CNB', arr: '18:10:00', dep: '18:15:00', dist: 440, plat: 1 },
                    { code: 'LKO', arr: '19:40:00', dep: '19:50:00', dist: 512, plat: 3 },
                    { code: 'GKP', arr: '00:55:00', dep: '01:05:00', dist: 782, plat: 1 },
                    { code: 'MFP', arr: '05:15:00', dep: '05:20:00', dist: 1042, plat: 2 },
                    { code: 'DBG', arr: '07:05:00', dep: null, dist: 1110, plat: 1 }
                ]
            },
            {
                number: '12565',
                name: 'Bihar Sampark Kranti Superfast (DBG - NDLS)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DBG', arr: null, dep: '08:25:00', dist: 0, plat: 1 },
                    { code: 'MFP', arr: '09:55:00', dep: '10:00:00', dist: 68, plat: 1 },
                    { code: 'GKP', arr: '14:35:00', dep: '14:45:00', dist: 328, plat: 1 },
                    { code: 'LKO', arr: '19:30:00', dep: '19:40:00', dist: 598, plat: 2 },
                    { code: 'CNB', arr: '21:30:00', dep: '21:35:00', dist: 670, plat: 1 },
                    { code: 'NDLS', arr: '05:15:00', dep: null, dist: 1110, plat: 14 }
                ]
            },

            // 5. Vikramshila Superfast (Anand Vihar ANVT - Patna PNBE - Bhagalpur BGP)
            {
                number: '12368',
                name: 'Vikramshila Superfast Express (ANVT - BGP)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'ANVT', arr: null, dep: '13:15:00', dist: 0, plat: 4 },
                    { code: 'CNB', arr: '18:25:00', dep: '18:30:00', dist: 428, plat: 1 },
                    { code: 'PRYJ', arr: '20:45:00', dep: '20:50:00', dist: 622, plat: 4 },
                    { code: 'MGS', arr: '23:35:00', dep: '23:45:00', dist: 775, plat: 2 },
                    { code: 'DNR', arr: '02:00:00', dep: '02:02:00', dist: 981, plat: 1 },
                    { code: 'PNBE', arr: '02:30:00', dep: '02:40:00', dist: 991, plat: 1 },
                    { code: 'BGP', arr: '08:15:00', dep: null, dist: 1209, plat: 1 }
                ]
            },
            {
                number: '12367',
                name: 'Vikramshila Superfast Express (BGP - ANVT)',
                type: 'Superfast',
                total_seats: 1900,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BGP', arr: null, dep: '12:00:00', dist: 0, plat: 1 },
                    { code: 'PNBE', arr: '16:55:00', dep: '17:05:00', dist: 218, plat: 1 },
                    { code: 'DNR', arr: '17:25:00', dep: '17:27:00', dist: 228, plat: 1 },
                    { code: 'MGS', arr: '20:30:00', dep: '20:40:00', dist: 434, plat: 2 },
                    { code: 'PRYJ', arr: '23:05:00', dep: '23:10:00', dist: 587, plat: 1 },
                    { code: 'CNB', arr: '01:40:00', dep: '01:45:00', dist: 781, plat: 1 },
                    { code: 'ANVT', arr: '07:20:00', dep: null, dist: 1209, plat: 4 }
                ]
            },

            // 6. Ranikhet Express (Delhi - Moradabad - Kathgodam KGM)
            {
                number: '15013',
                name: 'Ranikhet Express (DEC - KGM)',
                type: 'Express',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DEC', arr: null, dep: '20:30:00', dist: 0, plat: 2 },
                    { code: 'DLI', arr: '21:15:00', dep: '22:00:00', dist: 14, plat: 11 },
                    { code: 'GZB', arr: '22:48:00', dep: '22:50:00', dist: 34, plat: 2 },
                    { code: 'MB', arr: '01:30:00', dep: '01:40:00', dist: 175, plat: 1 },
                    { code: 'KGM', arr: '05:05:00', dep: null, dist: 292, plat: 1 }
                ]
            },
            {
                number: '15014',
                name: 'Ranikhet Express (KGM - DEC)',
                type: 'Express',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 500, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'KGM', arr: null, dep: '20:35:00', dist: 0, plat: 1 },
                    { code: 'MB', arr: '00:30:00', dep: '00:38:00', dist: 117, plat: 2 },
                    { code: 'GZB', arr: '03:11:00', dep: '03:13:00', dist: 258, plat: 3 },
                    { code: 'DLI', arr: '03:55:00', dep: '04:25:00', dist: 278, plat: 11 },
                    { code: 'DEC', arr: '05:10:00', dep: null, dist: 292, plat: 2 }
                ]
            },

            // 7. Punjab Mail (Mumbai CSMT - Rohtak - Patiala - Bathinda - Firozpur FZR)
            {
                number: '12137',
                name: 'Punjab Mail (CSMT - FZR)',
                type: 'Mail',
                total_seats: 1900,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '19:35:00', dist: 0, plat: 18 },
                    { code: 'DR', arr: '19:48:00', dep: '19:50:00', dist: 9, plat: 4 },
                    { code: 'KYN', arr: '20:32:00', dep: '20:35:00', dist: 54, plat: 4 },
                    { code: 'NK', arr: '23:00:00', dep: '23:05:00', dist: 187, plat: 2 },
                    { code: 'BSL', arr: '02:30:00', dep: '02:35:00', dist: 444, plat: 3 },
                    { code: 'BPL', arr: '09:30:00', dep: '09:35:00', dist: 837, plat: 2 },
                    { code: 'JHS', arr: '13:40:00', dep: '13:50:00', dist: 1129, plat: 1 },
                    { code: 'GWL', arr: '15:05:00', dep: '15:10:00', dist: 1227, plat: 2 },
                    { code: 'AGC', arr: '17:50:00', dep: '17:55:00', dist: 1345, plat: 2 },
                    { code: 'NDLS', arr: '21:10:00', dep: '21:40:00', dist: 1540, plat: 5 },
                    { code: 'ROK', arr: '22:58:00', dep: '23:00:00', dist: 1611, plat: 2 },
                    { code: 'PTA', arr: '02:18:00', dep: '02:20:00', dist: 1802, plat: 1 },
                    { code: 'BTI', arr: '03:40:00', dep: '03:55:00', dist: 1888, plat: 2 },
                    { code: 'FZR', arr: '05:10:00', dep: null, dist: 1930, plat: 1 }
                ]
            },
            {
                number: '12138',
                name: 'Punjab Mail (FZR - CSMT)',
                type: 'Mail',
                total_seats: 1900,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'FZR', arr: null, dep: '21:45:00', dist: 0, plat: 1 },
                    { code: 'BTI', arr: '23:25:00', dep: '23:50:00', dist: 42, plat: 1 },
                    { code: 'PTA', arr: '01:05:00', dep: '01:07:00', dist: 128, plat: 1 },
                    { code: 'ROK', arr: '03:41:00', dep: '03:43:00', dist: 319, plat: 1 },
                    { code: 'NDLS', arr: '05:00:00', dep: '05:15:00', dist: 390, plat: 5 },
                    { code: 'AGC', arr: '08:00:00', dep: '08:05:00', dist: 585, plat: 1 },
                    { code: 'GWL', arr: '09:43:00', dep: '09:45:00', dist: 703, plat: 1 },
                    { code: 'JHS', arr: '11:15:00', dep: '11:25:00', dist: 801, plat: 2 },
                    { code: 'BPL', arr: '15:35:00', dep: '15:40:00', dist: 1093, plat: 1 },
                    { code: 'BSL', arr: '23:30:00', dep: '23:35:00', dist: 1486, plat: 4 },
                    { code: 'NK', arr: '03:00:00', dep: '03:05:00', dist: 1743, plat: 3 },
                    { code: 'KYN', arr: '06:12:00', dep: '06:15:00', dist: 1876, plat: 6 },
                    { code: 'DR', arr: '07:02:00', dep: '07:05:00', dist: 1921, plat: 4 },
                    { code: 'CSMT', arr: '07:35:00', dep: null, dist: 1930, plat: 18 }
                ]
            },

            // 8. Kisan Express (Delhi - Rohtak - Hisar - Bathinda)
            {
                number: '14731',
                name: 'Kisan Express (DLI - BTI)',
                type: 'Express',
                total_seats: 1400,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 150, fare_per_km: 1.8 },
                    { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.42 },
                    { code: '2S', name: 'Second Sitting', seats: 800, fare_per_km: 0.35 }
                ],
                stops: [
                    { code: 'DLI', arr: null, dep: '14:00:00', dist: 0, plat: 2 },
                    { code: 'ROK', arr: '15:28:00', dep: '15:30:00', dist: 70, plat: 1 },
                    { code: 'HSR', arr: '17:05:00', dep: '17:15:00', dist: 167, plat: 1 },
                    { code: 'BTI', arr: '21:15:00', dep: null, dist: 284, plat: 3 }
                ]
            },
            {
                number: '14732',
                name: 'Kisan Express (BTI - DLI)',
                type: 'Express',
                total_seats: 1400,
                classes: [
                    { code: 'CC', name: 'AC Chair Car', seats: 150, fare_per_km: 1.8 },
                    { code: 'SL', name: 'Sleeper Class', seats: 450, fare_per_km: 0.42 },
                    { code: '2S', name: 'Second Sitting', seats: 800, fare_per_km: 0.35 }
                ],
                stops: [
                    { code: 'BTI', arr: null, dep: '05:00:00', dist: 0, plat: 3 },
                    { code: 'HSR', arr: '07:55:00', dep: '08:05:00', dist: 117, plat: 2 },
                    { code: 'ROK', arr: '09:43:00', dep: '09:45:00', dist: 214, plat: 1 },
                    { code: 'DLI', arr: '12:30:00', dep: null, dist: 284, plat: 2 }
                ]
            },

            // 9. Uttar Sampark Kranti (Delhi - Udhampur - Katra)
            {
                number: '12445',
                name: 'Uttar Sampark Kranti (NDLS - SVDK)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '20:50:00', dist: 0, plat: 2 },
                    { code: 'UMB', arr: '00:05:00', dep: '00:15:00', dist: 198, plat: 7 },
                    { code: 'LDH', arr: '01:50:00', dep: '02:00:00', dist: 312, plat: 2 },
                    { code: 'JAT', arr: '06:00:00', dep: '06:10:00', dist: 577, plat: 1 },
                    { code: 'UHP', arr: '07:05:00', dep: '07:07:00', dist: 630, plat: 1 },
                    { code: 'SVDK', arr: '07:55:00', dep: null, dist: 655, plat: 1 }
                ]
            },
            {
                number: '12446',
                name: 'Uttar Sampark Kranti (SVDK - NDLS)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SVDK', arr: null, dep: '19:55:00', dist: 0, plat: 1 },
                    { code: 'UHP', arr: '20:30:00', dep: '20:32:00', dist: 25, plat: 1 },
                    { code: 'JAT', arr: '21:30:00', dep: '21:40:00', dist: 78, plat: 2 },
                    { code: 'LDH', arr: '02:05:00', dep: '02:15:00', dist: 343, plat: 1 },
                    { code: 'UMB', arr: '04:00:00', dep: '04:10:00', dist: 457, plat: 6 },
                    { code: 'NDLS', arr: '06:55:00', dep: null, dist: 655, plat: 2 }
                ]
            },

            // 10. Mahalaxmi Superfast (Mumbai CSMT - Pune - Kolhapur KOP)
            {
                number: '17411',
                name: 'Mahalaxmi Express (CSMT - KOP)',
                type: 'Express',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '20:20:00', dist: 0, plat: 15 },
                    { code: 'DR', arr: '20:32:00', dep: '20:35:00', dist: 9, plat: 5 },
                    { code: 'TNA', arr: '20:58:00', dep: '21:00:00', dist: 34, plat: 5 },
                    { code: 'KYN', arr: '21:20:00', dep: '21:23:00', dist: 54, plat: 5 },
                    { code: 'PNQ', arr: '00:10:00', dep: '00:15:00', dist: 192, plat: 2 },
                    { code: 'KOP', arr: '07:20:00', dep: null, dist: 518, plat: 1 }
                ]
            },
            {
                number: '17412',
                name: 'Mahalaxmi Express (KOP - CSMT)',
                type: 'Express',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'KOP', arr: null, dep: '20:50:00', dist: 0, plat: 1 },
                    { code: 'PNQ', arr: '03:30:00', dep: '03:35:00', dist: 326, plat: 1 },
                    { code: 'KYN', arr: '06:17:00', dep: '06:20:00', dist: 464, plat: 7 },
                    { code: 'TNA', arr: '06:37:00', dep: '06:40:00', dist: 484, plat: 6 },
                    { code: 'DR', arr: '07:02:00', dep: '07:05:00', dist: 509, plat: 4 },
                    { code: 'CSMT', arr: '07:35:00', dep: null, dist: 518, plat: 15 }
                ]
            },

            // 11. Devagiri Express (CSMT - Nashik - Chhatrapati Sambhajinagar AWB - Nanded NED - Secunderabad SC)
            {
                number: '17057',
                name: 'Devagiri Express (CSMT - SC)',
                type: 'Express',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '21:30:00', dist: 0, plat: 14 },
                    { code: 'DR', arr: '21:42:00', dep: '21:45:00', dist: 9, plat: 4 },
                    { code: 'KYN', arr: '22:32:00', dep: '22:35:00', dist: 54, plat: 4 },
                    { code: 'NK', arr: '01:05:00', dep: '01:10:00', dist: 187, plat: 2 },
                    { code: 'MMR', arr: '02:15:00', dep: '02:20:00', dist: 260, plat: 5 },
                    { code: 'AWB', arr: '04:15:00', dep: '04:20:00', dist: 373, plat: 1 },
                    { code: 'NED', arr: '08:50:00', dep: '08:55:00', dist: 609, plat: 1 },
                    { code: 'SC', arr: '14:45:00', dep: null, dist: 878, plat: 2 }
                ]
            },
            {
                number: '17058',
                name: 'Devagiri Express (SC - CSMT)',
                type: 'Express',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SC', arr: null, dep: '13:25:00', dist: 0, plat: 2 },
                    { code: 'NED', arr: '18:50:00', dep: '18:55:00', dist: 269, plat: 1 },
                    { code: 'AWB', arr: '23:20:00', dep: '23:25:00', dist: 505, plat: 1 },
                    { code: 'MMR', arr: '01:45:00', dep: '01:50:00', dist: 618, plat: 1 },
                    { code: 'NK', arr: '02:45:00', dep: '02:50:00', dist: 691, plat: 3 },
                    { code: 'KYN', arr: '05:52:00', dep: '05:55:00', dist: 824, plat: 6 },
                    { code: 'DR', arr: '06:42:00', dep: '06:45:00', dist: 869, plat: 4 },
                    { code: 'CSMT', arr: '07:10:00', dep: null, dist: 878, plat: 14 }
                ]
            },

            // 12. Amravati Express (Mumbai CSMT - Amravati AMI)
            {
                number: '12111',
                name: 'Amravati Superfast Express (CSMT - AMI)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '19:55:00', dist: 0, plat: 16 },
                    { code: 'DR', arr: '20:07:00', dep: '20:10:00', dist: 9, plat: 4 },
                    { code: 'KYN', arr: '20:52:00', dep: '20:55:00', dist: 54, plat: 4 },
                    { code: 'NK', arr: '23:20:00', dep: '23:25:00', dist: 187, plat: 2 },
                    { code: 'BSL', arr: '02:50:00', dep: '02:55:00', dist: 444, plat: 3 },
                    { code: 'AK', arr: '05:10:00', dep: '05:15:00', dist: 584, plat: 2 },
                    { code: 'AMI', arr: '07:55:00', dep: null, dist: 672, plat: 1 }
                ]
            },
            {
                number: '12112',
                name: 'Amravati Superfast Express (AMI - CSMT)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'AMI', arr: null, dep: '19:10:00', dist: 0, plat: 1 },
                    { code: 'AK', arr: '20:30:00', dep: '20:35:00', dist: 88, plat: 1 },
                    { code: 'BSL', arr: '22:50:00', dep: '22:55:00', dist: 228, plat: 5 },
                    { code: 'NK', arr: '02:05:00', dep: '02:10:00', dist: 485, plat: 3 },
                    { code: 'KYN', arr: '05:02:00', dep: '05:05:00', dist: 618, plat: 6 },
                    { code: 'DR', arr: '05:52:00', dep: '05:55:00', dist: 663, plat: 4 },
                    { code: 'CSMT', arr: '06:15:00', dep: null, dist: 672, plat: 16 }
                ]
            },

            // 13. Saurashtra Mail (Mumbai - Ahmedabad - Rajkot - Jamnagar - Okha)
            {
                number: '22945',
                name: 'Saurashtra Mail (BCT - OKHA)',
                type: 'Mail',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BCT', arr: null, dep: '21:05:00', dist: 0, plat: 3 },
                    { code: 'ST', arr: '01:02:00', dep: '01:07:00', dist: 263, plat: 1 },
                    { code: 'BRC', arr: '02:50:00', dep: '02:55:00', dist: 392, plat: 2 },
                    { code: 'ANND', arr: '03:28:00', dep: '03:30:00', dist: 428, plat: 3 },
                    { code: 'ADI', arr: '05:15:00', dep: '05:30:00', dist: 491, plat: 4 },
                    { code: 'RJT', arr: '09:20:00', dep: '09:30:00', dist: 738, plat: 1 },
                    { code: 'JAM', arr: '11:05:00', dep: '11:10:00', dist: 823, plat: 1 },
                    { code: 'OKHA', arr: '14:55:00', dep: null, dist: 989, plat: 1 }
                ]
            },
            {
                number: '22946',
                name: 'Saurashtra Mail (OKHA - BCT)',
                type: 'Mail',
                total_seats: 1850,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'OKHA', arr: null, dep: '11:05:00', dist: 0, plat: 1 },
                    { code: 'JAM', arr: '14:15:00', dep: '14:20:00', dist: 166, plat: 1 },
                    { code: 'RJT', arr: '15:55:00', dep: '16:05:00', dist: 251, plat: 2 },
                    { code: 'ADI', arr: '20:30:00', dep: '20:45:00', dist: 498, plat: 5 },
                    { code: 'ANND', arr: '21:50:00', dep: '21:52:00', dist: 561, plat: 4 },
                    { code: 'BRC', arr: '22:30:00', dep: '22:35:00', dist: 597, plat: 1 },
                    { code: 'ST', arr: '00:28:00', dep: '00:33:00', dist: 726, plat: 2 },
                    { code: 'BCT', arr: '04:55:00', dep: null, dist: 989, plat: 3 }
                ]
            },

            // 14. Porbandar Superfast (Bandra BDTS - Porbandar PBR)
            {
                number: '19015',
                name: 'Saurashtra Express (BDTS - PBR)',
                type: 'Express',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BDTS', arr: null, dep: '09:20:00', dist: 0, plat: 3 },
                    { code: 'ST', arr: '14:25:00', dep: '14:30:00', dist: 252, plat: 1 },
                    { code: 'BRC', arr: '16:35:00', dep: '16:40:00', dist: 381, plat: 3 },
                    { code: 'ADI', arr: '20:05:00', dep: '20:20:00', dist: 481, plat: 1 },
                    { code: 'RJT', arr: '01:10:00', dep: '01:20:00', dist: 728, plat: 2 },
                    { code: 'JAM', arr: '02:50:00', dep: '02:55:00', dist: 813, plat: 1 },
                    { code: 'PBR', arr: '05:30:00', dep: null, dist: 955, plat: 1 }
                ]
            },

            // 15. Bhavnagar Superfast (Bandra BDTS - Bhavnagar BVP)
            {
                number: '12971',
                name: 'Bhavnagar Superfast Express (BDTS - BVP)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BDTS', arr: null, dep: '19:10:00', dist: 0, plat: 2 },
                    { code: 'ST', arr: '23:02:00', dep: '23:07:00', dist: 252, plat: 1 },
                    { code: 'BRC', arr: '00:45:00', dep: '00:50:00', dist: 381, plat: 2 },
                    { code: 'ADI', arr: '02:40:00', dep: '02:50:00', dist: 481, plat: 3 },
                    { code: 'BVP', arr: '08:05:00', dep: null, dist: 778, plat: 1 }
                ]
            },

            // 16. Kutch Express (Bandra BDTS - Gandhidham GIMB)
            {
                number: '22955',
                name: 'Kutch Superfast Express (BDTS - GIMB)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BDTS', arr: null, dep: '17:45:00', dist: 0, plat: 6 },
                    { code: 'ST', arr: '21:37:00', dep: '21:42:00', dist: 252, plat: 1 },
                    { code: 'BRC', arr: '23:28:00', dep: '23:33:00', dist: 381, plat: 2 },
                    { code: 'ADI', arr: '01:35:00', dep: '01:50:00', dist: 481, plat: 6 },
                    { code: 'GIMB', arr: '07:30:00', dep: null, dist: 781, plat: 1 }
                ]
            },
            {
                number: '22956',
                name: 'Kutch Superfast Express (GIMB - BDTS)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'GIMB', arr: null, dep: '20:15:00', dist: 0, plat: 1 },
                    { code: 'ADI', arr: '02:35:00', dep: '02:50:00', dist: 300, plat: 7 },
                    { code: 'BRC', arr: '04:40:00', dep: '04:45:00', dist: 400, plat: 1 },
                    { code: 'ST', arr: '06:47:00', dep: '06:52:00', dist: 529, plat: 2 },
                    { code: 'BDTS', arr: '11:25:00', dep: null, dist: 781, plat: 6 }
                ]
            },

            // 17. Bikaner Superfast (Delhi - Jaipur - Bikaner BKN)
            {
                number: '12457',
                name: 'Bikaner Superfast Express (DEE - BKN)',
                type: 'Superfast',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DEC', arr: null, dep: '23:35:00', dist: 0, plat: 1 },
                    { code: 'JP', arr: '04:30:00', dep: '04:40:00', dist: 300, plat: 2 },
                    { code: 'BKN', arr: '10:30:00', dep: null, dist: 678, plat: 1 }
                ]
            },
            {
                number: '12458',
                name: 'Bikaner Superfast Express (BKN - DEE)',
                type: 'Superfast',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'BKN', arr: null, dep: '22:30:00', dist: 0, plat: 1 },
                    { code: 'JP', arr: '04:15:00', dep: '04:25:00', dist: 378, plat: 1 },
                    { code: 'DEC', arr: '09:45:00', dep: null, dist: 678, plat: 1 }
                ]
            },

            // 18. Jaisalmer Express (Delhi - Jaipur - Jodhpur - Jaisalmer JSM)
            {
                number: '14659',
                name: 'Runicha Express (DLI - JSM)',
                type: 'Express',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'DLI', arr: null, dep: '17:35:00', dist: 0, plat: 9 },
                    { code: 'DEC', arr: '18:15:00', dep: '18:17:00', dist: 14, plat: 1 },
                    { code: 'JP', arr: '23:35:00', dep: '23:45:00', dist: 308, plat: 2 },
                    { code: 'JU', arr: '05:05:00', dep: '05:20:00', dist: 618, plat: 1 },
                    { code: 'JSM', arr: '11:40:00', dep: null, dist: 914, plat: 1 }
                ]
            },
            {
                number: '14660',
                name: 'Runicha Express (JSM - DLI)',
                type: 'Express',
                total_seats: 1650,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'JSM', arr: null, dep: '16:45:00', dist: 0, plat: 1 },
                    { code: 'JU', arr: '23:05:00', dep: '23:20:00', dist: 296, plat: 2 },
                    { code: 'JP', arr: '04:45:00', dep: '04:55:00', dist: 606, plat: 1 },
                    { code: 'DEC', arr: '10:05:00', dep: '10:07:00', dist: 900, plat: 3 },
                    { code: 'DLI', arr: '10:45:00', dep: null, dist: 914, plat: 9 }
                ]
            },

            // 19. Rewanchal Express (Bhopal - Jabalpur - Katni KTE - Rewa REWA)
            {
                number: '12185',
                name: 'Rewanchal Superfast (RKMP - REWA)',
                type: 'Superfast',
                total_seats: 1600,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'RKMP', arr: null, dep: '22:00:00', dist: 0, plat: 1 },
                    { code: 'BPL', arr: '22:12:00', dep: '22:15:00', dist: 6, plat: 2 },
                    { code: 'ET', arr: '23:55:00', dep: '00:05:00', dist: 98, plat: 3 },
                    { code: 'JBP', arr: '03:15:00', dep: '03:25:00', dist: 343, plat: 1 },
                    { code: 'KTE', arr: '04:45:00', dep: '04:50:00', dist: 434, plat: 2 },
                    { code: 'STA', arr: '06:15:00', dep: '06:20:00', dist: 532, plat: 1 },
                    { code: 'REWA', arr: '08:00:00', dep: null, dist: 582, plat: 1 }
                ]
            },
            {
                number: '12186',
                name: 'Rewanchal Superfast (REWA - RKMP)',
                type: 'Superfast',
                total_seats: 1600,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'REWA', arr: null, dep: '20:05:00', dist: 0, plat: 1 },
                    { code: 'STA', arr: '20:55:00', dep: '21:00:00', dist: 50, plat: 1 },
                    { code: 'KTE', arr: '22:30:00', dep: '22:35:00', dist: 148, plat: 2 },
                    { code: 'JBP', arr: '00:05:00', dep: '00:15:00', dist: 239, plat: 1 },
                    { code: 'ET', arr: '03:40:00', dep: '03:50:00', dist: 484, plat: 2 },
                    { code: 'BPL', arr: '05:15:00', dep: '05:20:00', dist: 576, plat: 3 },
                    { code: 'RKMP', arr: '05:35:00', dep: null, dist: 582, plat: 1 }
                ]
            },

            // 20. Sealdah Rajdhani (Delhi - Sealdah SDAH)
            {
                number: '12314',
                name: 'Sealdah Rajdhani Express (NDLS - SDAH)',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'NDLS', arr: null, dep: '16:30:00', dist: 0, plat: 12 },
                    { code: 'CNB', arr: '21:12:00', dep: '21:17:00', dist: 440, plat: 1 },
                    { code: 'PRYJ', arr: '23:25:00', dep: '23:27:00', dist: 635, plat: 4 },
                    { code: 'MGS', arr: '01:27:00', dep: '01:37:00', dist: 787, plat: 2 },
                    { code: 'GAYA', arr: '03:45:00', dep: '03:48:00', dist: 992, plat: 1 },
                    { code: 'DHN', arr: '06:18:00', dep: '06:23:00', dist: 1191, plat: 1 },
                    { code: 'ASN', arr: '07:09:00', dep: '07:11:00', dist: 1250, plat: 5 },
                    { code: 'SDAH', arr: '10:10:00', dep: null, dist: 1458, plat: 12 }
                ]
            },
            {
                number: '12313',
                name: 'Sealdah Rajdhani Express (SDAH - NDLS)',
                type: 'Rajdhani',
                total_seats: 1200,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 24, fare_per_km: 4.8 },
                    { code: '2A', name: 'AC Two Tier', seats: 54, fare_per_km: 2.9 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.95 }
                ],
                stops: [
                    { code: 'SDAH', arr: null, dep: '16:50:00', dist: 0, plat: 12 },
                    { code: 'ASN', arr: '18:57:00', dep: '19:00:00', dist: 208, plat: 4 },
                    { code: 'DHN', arr: '19:55:00', dep: '20:00:00', dist: 267, plat: 1 },
                    { code: 'GAYA', arr: '22:19:00', dep: '22:22:00', dist: 466, plat: 1 },
                    { code: 'MGS', arr: '00:45:00', dep: '00:55:00', dist: 671, plat: 2 },
                    { code: 'PRYJ', arr: '02:33:00', dep: '02:35:00', dist: 823, plat: 1 },
                    { code: 'CNB', arr: '04:40:00', dep: '04:45:00', dist: 1018, plat: 1 },
                    { code: 'NDLS', arr: '10:25:00', dep: null, dist: 1458, plat: 12 }
                ]
            },

            // 21. Tapaswini Express (Rourkela - Jharsuguda JSG - Sambalpur SBP - Cuttack - Bhubaneswar - Puri)
            {
                number: '18451',
                name: 'Tapaswini Express (HTE - ROU - SBP - PURI)',
                type: 'Express',
                total_seats: 1600,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HTE', arr: null, dep: '16:00:00', dist: 0, plat: 2 },
                    { code: 'ROU', arr: '19:05:00', dep: '19:15:00', dist: 165, plat: 1 },
                    { code: 'JSG', arr: '21:10:00', dep: '21:15:00', dist: 266, plat: 1 },
                    { code: 'SBP', arr: '22:10:00', dep: '22:20:00', dist: 315, plat: 1 },
                    { code: 'CTC', arr: '04:05:00', dep: '04:10:00', dist: 605, plat: 3 },
                    { code: 'BBS', arr: '04:45:00', dep: '04:50:00', dist: 633, plat: 4 },
                    { code: 'PURI', arr: '06:10:00', dep: null, dist: 696, plat: 4 }
                ]
            },
            {
                number: '18452',
                name: 'Tapaswini Express (PURI - SBP - ROU - HTE)',
                type: 'Express',
                total_seats: 1600,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'PURI', arr: null, dep: '20:30:00', dist: 0, plat: 4 },
                    { code: 'BBS', arr: '21:40:00', dep: '21:45:00', dist: 63, plat: 2 },
                    { code: 'CTC', arr: '22:15:00', dep: '22:20:00', dist: 91, plat: 1 },
                    { code: 'SBP', arr: '03:55:00', dep: '04:10:00', dist: 381, plat: 2 },
                    { code: 'JSG', arr: '05:20:00', dep: '05:25:00', dist: 430, plat: 2 },
                    { code: 'ROU', arr: '07:00:00', dep: '07:10:00', dist: 531, plat: 2 },
                    { code: 'HTE', arr: '10:30:00', dep: null, dist: 696, plat: 2 }
                ]
            },

            // 22. Venkatadri Superfast (Kacheguda KCG - Kurnool KRN - Tirupati TPTY)
            {
                number: '12797',
                name: 'Venkatadri Superfast Express (KCG - TPTY)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'KCG', arr: null, dep: '20:05:00', dist: 0, plat: 3 },
                    { code: 'KRN', arr: '00:03:00', dep: '00:05:00', dist: 236, plat: 2 },
                    { code: 'RU', arr: '06:10:00', dep: '06:15:00', dist: 627, plat: 1 },
                    { code: 'TPTY', arr: '07:05:00', dep: null, dist: 636, plat: 1 }
                ]
            },
            {
                number: '12798',
                name: 'Venkatadri Superfast Express (TPTY - KCG)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'TPTY', arr: null, dep: '18:30:00', dist: 0, plat: 1 },
                    { code: 'RU', arr: '18:50:00', dep: '18:52:00', dist: 9, plat: 3 },
                    { code: 'KRN', arr: '01:05:00', dep: '01:07:00', dist: 400, plat: 1 },
                    { code: 'KCG', arr: '06:20:00', dep: null, dist: 636, plat: 3 }
                ]
            },

            // 23. Andhra Pradesh Express / Guntur Superfast (Visakhapatnam - Vizianagaram VZM - Vijayawada - Guntur GNT)
            {
                number: '12727',
                name: 'Godavari Superfast (VSKP - VZM - BZA - HYB)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'VZM', arr: null, dep: '16:20:00', dist: 0, plat: 1 },
                    { code: 'VSKP', arr: '17:20:00', dep: '17:40:00', dist: 61, plat: 1 },
                    { code: 'RJY', arr: '20:18:00', dep: '20:20:00', dist: 261, plat: 1 },
                    { code: 'BZA', arr: '23:30:00', dep: '23:45:00', dist: 411, plat: 7 },
                    { code: 'GNT', arr: '00:30:00', dep: '00:35:00', dist: 443, plat: 1 },
                    { code: 'SC', arr: '05:30:00', dep: '05:35:00', dist: 724, plat: 1 },
                    { code: 'HYB', arr: '06:15:00', dep: null, dist: 733, plat: 4 }
                ]
            },

            // 24. Nellai Superfast Express (Chennai MS - Madurai MDU - Tirunelveli TEN)
            {
                number: '12631',
                name: 'Nellai Superfast Express (MS - TEN)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MS', arr: null, dep: '20:10:00', dist: 0, plat: 7 },
                    { code: 'TBM', arr: '20:38:00', dep: '20:40:00', dist: 25, plat: 8 },
                    { code: 'TPJ', arr: '01:50:00', dep: '01:55:00', dist: 336, plat: 1 },
                    { code: 'MDU', arr: '03:50:00', dep: '03:55:00', dist: 497, plat: 2 },
                    { code: 'TEN', arr: '06:40:00', dep: null, dist: 654, plat: 1 }
                ]
            },
            {
                number: '12632',
                name: 'Nellai Superfast Express (TEN - MS)',
                type: 'Superfast',
                total_seats: 1800,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'TEN', arr: null, dep: '19:50:00', dist: 0, plat: 1 },
                    { code: 'MDU', arr: '22:20:00', dep: '22:25:00', dist: 157, plat: 1 },
                    { code: 'TPJ', arr: '00:55:00', dep: '01:00:00', dist: 318, plat: 3 },
                    { code: 'TBM', arr: '06:03:00', dep: '06:05:00', dist: 629, plat: 7 },
                    { code: 'MS', arr: '06:55:00', dep: null, dist: 654, plat: 7 }
                ]
            },

            // 25. Rameswaram Superfast Express (Chennai MS - Madurai - Rameswaram RMM)
            {
                number: '22661',
                name: 'Rameswaram Superfast (MS - RMM)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MS', arr: null, dep: '17:45:00', dist: 0, plat: 6 },
                    { code: 'TBM', arr: '18:13:00', dep: '18:15:00', dist: 25, plat: 7 },
                    { code: 'TPJ', arr: '23:35:00', dep: '23:40:00', dist: 336, plat: 2 },
                    { code: 'MDU', arr: '01:40:00', dep: '01:45:00', dist: 497, plat: 1 },
                    { code: 'RMM', arr: '05:05:00', dep: null, dist: 602, plat: 1 }
                ]
            },
            {
                number: '22662',
                name: 'Rameswaram Superfast (RMM - MS)',
                type: 'Superfast',
                total_seats: 1750,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'RMM', arr: null, dep: '20:30:00', dist: 0, plat: 1 },
                    { code: 'MDU', arr: '23:45:00', dep: '23:50:00', dist: 105, plat: 2 },
                    { code: 'TPJ', arr: '01:50:00', dep: '01:55:00', dist: 266, plat: 1 },
                    { code: 'TBM', arr: '06:18:00', dep: '06:20:00', dist: 577, plat: 5 },
                    { code: 'MS', arr: '07:10:00', dep: null, dist: 602, plat: 6 }
                ]
            },

            // 26. Hampi Express (KSR Bengaluru - Yesvantpur YPR - Ballari BAY - Hosapete HPT)
            {
                number: '16592',
                name: 'Hampi Express (MYS - SBC - YPR - HPT)',
                type: 'Express',
                total_seats: 1700,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'MYS', arr: null, dep: '18:50:00', dist: 0, plat: 1 },
                    { code: 'SBC', arr: '21:40:00', dep: '21:50:00', dist: 139, plat: 8 },
                    { code: 'YPR', arr: '22:00:00', dep: '22:02:00', dist: 145, plat: 3 },
                    { code: 'BAY', arr: '04:35:00', dep: '04:40:00', dist: 469, plat: 1 },
                    { code: 'HPT', arr: '05:50:00', dep: null, dist: 504, plat: 1 }
                ]
            },
            {
                number: '16591',
                name: 'Hampi Express (HPT - BAY - YPR - SBC - MYS)',
                type: 'Express',
                total_seats: 1700,
                classes: [
                    { code: '1A', name: 'AC First Class', seats: 20, fare_per_km: 4.5 },
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'HPT', arr: null, dep: '18:30:00', dist: 0, plat: 1 },
                    { code: 'BAY', arr: '19:40:00', dep: '19:45:00', dist: 35, plat: 1 },
                    { code: 'YPR', arr: '02:45:00', dep: '02:47:00', dist: 359, plat: 2 },
                    { code: 'SBC', arr: '03:10:00', dep: '03:20:00', dist: 365, plat: 7 },
                    { code: 'MYS', arr: '06:10:00', dep: null, dist: 504, plat: 1 }
                ]
            },

            // 27. SMVT Special (Bengaluru SMVB - Chennai - Vijayawada)
            {
                number: '12551',
                name: 'SMVB - Kamakhya Superfast (SMVB - GHY via VZA, BBS)',
                type: 'Superfast',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'SMVB', arr: null, dep: '08:50:00', dist: 0, plat: 1 },
                    { code: 'MAS', arr: '14:30:00', dep: '14:55:00', dist: 355, plat: 1 },
                    { code: 'BZA', arr: '21:05:00', dep: '21:15:00', dist: 786, plat: 1 },
                    { code: 'BBS', arr: '07:30:00', dep: '07:35:00', dist: 1445, plat: 3 },
                    { code: 'KGP', arr: '13:00:00', dep: '13:05:00', dist: 1767, plat: 2 },
                    { code: 'MLDT', arr: '21:30:00', dep: '21:40:00', dist: 2190, plat: 1 },
                    { code: 'NJP', arr: '01:25:00', dep: '01:35:00', dist: 2425, plat: 1 },
                    { code: 'GHY', arr: '10:05:00', dep: null, dist: 2855, plat: 1 }
                ]
            },

            // 28. Barak Brahmaputra Express (Guwahati - Silchar SCL - Agartala AGTL)
            {
                number: '12503',
                name: 'Barak Brahmaputra Express (GHY - SCL - AGTL)',
                type: 'Express',
                total_seats: 1600,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'GHY', arr: null, dep: '17:35:00', dist: 0, plat: 2 },
                    { code: 'SCL', arr: '04:40:00', dep: '05:05:00', dist: 379, plat: 1 },
                    { code: 'AGTL', arr: '13:00:00', dep: null, dist: 588, plat: 1 }
                ]
            },
            {
                number: '12504',
                name: 'Barak Brahmaputra Express (AGTL - SCL - GHY)',
                type: 'Express',
                total_seats: 1600,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'AGTL', arr: null, dep: '16:05:00', dist: 0, plat: 1 },
                    { code: 'SCL', arr: '00:15:00', dep: '00:40:00', dist: 209, plat: 1 },
                    { code: 'GHY', arr: '11:45:00', dep: null, dist: 588, plat: 2 }
                ]
            },

            // 29. Donyi Polo Express (Guwahati - Naharlagun NHLN)
            {
                number: '15817',
                name: 'Donyi Polo Express (GHY - NHLN)',
                type: 'Express',
                total_seats: 1500,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'GHY', arr: null, dep: '23:15:00', dist: 0, plat: 3 },
                    { code: 'NHLN', arr: '06:45:00', dep: null, dist: 332, plat: 1 }
                ]
            },
            {
                number: '15818',
                name: 'Donyi Polo Express (NHLN - GHY)',
                type: 'Express',
                total_seats: 1500,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'NHLN', arr: null, dep: '20:00:00', dist: 0, plat: 1 },
                    { code: 'GHY', arr: '04:30:00', dep: null, dist: 332, plat: 3 }
                ]
            },

            // 30. Lokmanya Tilak Terminus LTT Express (LTT - Thane - Kalyan - Pune - Secunderabad)
            {
                number: '11019',
                name: 'Konark Express (CSMT - LTT - BBS)',
                type: 'Express',
                total_seats: 1850,
                classes: [
                    { code: '2A', name: 'AC Two Tier', seats: 48, fare_per_km: 2.8 },
                    { code: '3A', name: 'AC Three Tier', seats: 160, fare_per_km: 1.85 },
                    { code: 'SL', name: 'Sleeper Class', seats: 520, fare_per_km: 0.43 }
                ],
                stops: [
                    { code: 'CSMT', arr: null, dep: '14:00:00', dist: 0, plat: 15 },
                    { code: 'DR', arr: '14:12:00', dep: '14:15:00', dist: 9, plat: 4 },
                    { code: 'TNA', arr: '14:38:00', dep: '14:40:00', dist: 34, plat: 5 },
                    { code: 'KYN', arr: '14:57:00', dep: '15:00:00', dist: 54, plat: 4 },
                    { code: 'PNQ', arr: '17:55:00', dep: '18:00:00', dist: 192, plat: 3 },
                    { code: 'SUR', arr: '22:15:00', dep: '22:20:00', dist: 455, plat: 1 },
                    { code: 'KLBG', arr: '00:02:00', dep: '00:05:00', dist: 568, plat: 2 },
                    { code: 'SC', arr: '03:20:00', dep: '03:30:00', dist: 785, plat: 1 },
                    { code: 'KZJ', arr: '05:33:00', dep: '05:35:00', dist: 917, plat: 1 },
                    { code: 'BZA', arr: '10:15:00', dep: '10:30:00', dist: 1134, plat: 6 },
                    { code: 'VSKP', arr: '16:05:00', dep: '16:25:00', dist: 1484, plat: 1 },
                    { code: 'BAM', arr: '20:40:00', dep: '20:45:00', dist: 1762, plat: 1 },
                    { code: 'BBS', arr: '23:20:00', dep: null, dist: 1928, plat: 3 }
                ]
            }
        ];

        let insertedCount = 0;
        let routeCount = 0;

        for (const t of trains) {
            const [existing] = await connection.query('SELECT train_id FROM trains WHERE train_number = ?', [t.number]);
            let trainId;

            if (existing.length > 0) {
                trainId = existing[0].train_id;
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
                insertedCount++;
            }

            // Schedule
            await connection.query(
                `INSERT INTO train_schedule (train_id, runs_on_mon, runs_on_tue, runs_on_wed, runs_on_thu, runs_on_fri, runs_on_sat, runs_on_sun)
                 VALUES (?, 1, 1, 1, 1, 1, 1, 1)
                 ON DUPLICATE KEY UPDATE runs_on_mon=1, runs_on_tue=1, runs_on_wed=1, runs_on_thu=1, runs_on_fri=1, runs_on_sat=1, runs_on_sun=1`,
                [trainId]
            );

            // Classes - safe upsert
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
                routeCount++;
            }
        }

        await connection.commit();
        console.log(`✅ Success! Part 2 added ${insertedCount} new trains and ${routeCount} route stops.`);
    } catch (err) {
        await connection.rollback();
        console.error('❌ Part 2 failed:', err);
    } finally {
        connection.release();
    }
}

seedPart2().then(() => {
    process.exit(0);
});
