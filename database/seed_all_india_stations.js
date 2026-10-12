// ============================================================
// Add Comprehensive All-India Railway Stations
// Across all 18 Indian Railway Zones & Major Junctions/Districts
// ============================================================

const db = require('./db');

const allIndiaStations = [
    // --- NORTHERN RAILWAY (NR) & NORTH CENTRAL (NCR) ---
    { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', zone: 'NR' },
    { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi', zone: 'NR' },
    { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', zone: 'NR' },
    { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi', zone: 'NR' },
    { code: 'DEC', name: 'Delhi Cantt', city: 'Delhi', state: 'Delhi', zone: 'NR' },
    { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'AF', name: 'Agra Fort', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'MTJ', name: 'Mathura Junction', city: 'Mathura', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'ALJN', name: 'Aligarh Junction', city: 'Aligarh', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'LKO', name: 'Lucknow Charbagh NR', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'LJN', name: 'Lucknow Junction NER', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'BSBS', name: 'Banaras', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER' },
    { code: 'BE', name: 'Bareilly Junction', city: 'Bareilly', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'MB', name: 'Moradabad Junction', city: 'Moradabad', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'SRE', name: 'Saharanpur Junction', city: 'Saharanpur', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'MTC', name: 'Meerut City', city: 'Meerut', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'GZB', name: 'Ghaziabad Junction', city: 'Ghaziabad', state: 'Uttar Pradesh', zone: 'NR' },
    { code: 'JHS', name: 'Virangana Lakshmibai Jhansi', city: 'Jhansi', state: 'Uttar Pradesh', zone: 'NCR' },
    { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR' },
    { code: 'HW', name: 'Haridwar', city: 'Haridwar', state: 'Uttarakhand', zone: 'NR' },
    { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', zone: 'NR' },
    { code: 'KGM', name: 'Kathgodam', city: 'Haldwani', state: 'Uttarakhand', zone: 'NER' },
    { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'NR' },
    { code: 'LDH', name: 'Ludhiana Junction', city: 'Ludhiana', state: 'Punjab', zone: 'NR' },
    { code: 'JUC', name: 'Jalandhar City', city: 'Jalandhar', state: 'Punjab', zone: 'NR' },
    { code: 'BTI', name: 'Bathinda Junction', city: 'Bathinda', state: 'Punjab', zone: 'NR' },
    { code: 'FZR', name: 'Firozpur Cantt', city: 'Firozpur', state: 'Punjab', zone: 'NR' },
    { code: 'PTA', name: 'Patiala', city: 'Patiala', state: 'Punjab', zone: 'NR' },
    { code: 'UMB', name: 'Ambala Cantt Junction', city: 'Ambala', state: 'Haryana', zone: 'NR' },
    { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', zone: 'NR' },
    { code: 'KLK', name: 'Kalka', city: 'Kalka', state: 'Haryana', zone: 'NR' },
    { code: 'PNP', name: 'Panipat Junction', city: 'Panipat', state: 'Haryana', zone: 'NR' },
    { code: 'ROK', name: 'Rohtak Junction', city: 'Rohtak', state: 'Haryana', zone: 'NR' },
    { code: 'HSR', name: 'Hisar Junction', city: 'Hisar', state: 'Haryana', zone: 'NR' },
    { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu & Kashmir', zone: 'NR' },
    { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu & Kashmir', zone: 'NR' },
    { code: 'UHP', name: 'Udhampur', city: 'Udhampur', state: 'Jammu & Kashmir', zone: 'NR' },

    // --- WESTERN RAILWAY (WR) & CENTRAL RAILWAY (CR) ---
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
    { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
    { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
    { code: 'DR', name: 'Dadar Central', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
    { code: 'DDR', name: 'Dadar Western', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
    { code: 'TNA', name: 'Thane', city: 'Thane', state: 'Maharashtra', zone: 'CR' },
    { code: 'KYN', name: 'Kalyan Junction', city: 'Kalyan', state: 'Maharashtra', zone: 'CR' },
    { code: 'PNVL', name: 'Panvel Junction', city: 'Navi Mumbai', state: 'Maharashtra', zone: 'CR' },
    { code: 'PNQ', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR' },
    { code: 'SUR', name: 'Solapur Junction', city: 'Solapur', state: 'Maharashtra', zone: 'CR' },
    { code: 'NK', name: 'Nashik Road', city: 'Nashik', state: 'Maharashtra', zone: 'CR' },
    { code: 'MMR', name: 'Manmad Junction', city: 'Manmad', state: 'Maharashtra', zone: 'CR' },
    { code: 'BSL', name: 'Bhusaval Junction', city: 'Bhusaval', state: 'Maharashtra', zone: 'CR' },
    { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR' },
    { code: 'KOP', name: 'Chhatrapati Shahu Maharaj Terminus Kolhapur', city: 'Kolhapur', state: 'Maharashtra', zone: 'CR' },
    { code: 'AWB', name: 'Chhatrapati Sambhajinagar (Aurangabad)', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', zone: 'SCR' },
    { code: 'NED', name: 'Hazur Sahib Nanded', city: 'Nanded', state: 'Maharashtra', zone: 'SCR' },
    { code: 'AMI', name: 'Amravati', city: 'Amravati', state: 'Maharashtra', zone: 'CR' },
    { code: 'AK', name: 'Akola Junction', city: 'Akola', state: 'Maharashtra', zone: 'CR' },
    { code: 'CD', name: 'Chandrapur', city: 'Chandrapur', state: 'Maharashtra', zone: 'CR' },
    { code: 'MAO', name: 'Madgaon Junction', city: 'Madgaon', state: 'Goa', zone: 'KR' },
    { code: 'THVM', name: 'Thivim', city: 'Thivim', state: 'Goa', zone: 'KR' },
    { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR' },
    { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'WR' },
    { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'WR' },
    { code: 'RJT', name: 'Rajkot Junction', city: 'Rajkot', state: 'Gujarat', zone: 'WR' },
    { code: 'BVP', name: 'Bhavnagar Terminus', city: 'Bhavnagar', state: 'Gujarat', zone: 'WR' },
    { code: 'JAM', name: 'Jamnagar', city: 'Jamnagar', state: 'Gujarat', zone: 'WR' },
    { code: 'PBR', name: 'Porbandar', city: 'Porbandar', state: 'Gujarat', zone: 'WR' },
    { code: 'OKHA', name: 'Okha', city: 'Okha', state: 'Gujarat', zone: 'WR' },
    { code: 'GIMB', name: 'Gandhidham Junction', city: 'Gandhidham', state: 'Gujarat', zone: 'WR' },
    { code: 'BH', name: 'Bharuch Junction', city: 'Bharuch', state: 'Gujarat', zone: 'WR' },
    { code: 'ANND', name: 'Anand Junction', city: 'Anand', state: 'Gujarat', zone: 'WR' },
    { code: 'VAPI', name: 'Vapi', city: 'Vapi', state: 'Gujarat', zone: 'WR' },
    { code: 'BL', name: 'Valsad', city: 'Valsad', state: 'Gujarat', zone: 'WR' },

    // --- NORTH WESTERN (NWR) & WEST CENTRAL (WCR) ---
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR' },
    { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'NWR' },
    { code: 'AII', name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan', zone: 'NWR' },
    { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan', zone: 'NWR' },
    { code: 'BKN', name: 'Bikaner Junction', city: 'Bikaner', state: 'Rajasthan', zone: 'NWR' },
    { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', zone: 'WCR' },
    { code: 'SWM', name: 'Sawai Madhopur Junction', city: 'Sawai Madhopur', state: 'Rajasthan', zone: 'WCR' },
    { code: 'ABR', name: 'Abu Road', city: 'Abu Road', state: 'Rajasthan', zone: 'NWR' },
    { code: 'JSM', name: 'Jaisalmer', city: 'Jaisalmer', state: 'Rajasthan', zone: 'NWR' },
    { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'RKMP', name: 'Rani Kamalapati (Habibganj)', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh', zone: 'WR' },
    { code: 'UJN', name: 'Ujjain Junction', city: 'Ujjain', state: 'Madhya Pradesh', zone: 'WR' },
    { code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'RTM', name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh', zone: 'WR' },
    { code: 'ET', name: 'Itarsi Junction', city: 'Itarsi', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'KTE', name: 'Katni Junction', city: 'Katni', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'STA', name: 'Satna Junction', city: 'Satna', state: 'Madhya Pradesh', zone: 'WCR' },
    { code: 'REWA', name: 'Rewa', city: 'Rewa', state: 'Madhya Pradesh', zone: 'WCR' },

    // --- EASTERN (ER), EAST CENTRAL (ECR) & SOUTH EASTERN (SER) ---
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
    { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
    { code: 'KOAA', name: 'Kolkata Chitpur Terminus', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
    { code: 'SHM', name: 'Shalimar', city: 'Kolkata', state: 'West Bengal', zone: 'SER' },
    { code: 'KGP', name: 'Kharagpur Junction', city: 'Kharagpur', state: 'West Bengal', zone: 'SER' },
    { code: 'ASN', name: 'Asansol Junction', city: 'Asansol', state: 'West Bengal', zone: 'ER' },
    { code: 'DGR', name: 'Durgapur', city: 'Durgapur', state: 'West Bengal', zone: 'ER' },
    { code: 'BWN', name: 'Barddhaman Junction', city: 'Bardhaman', state: 'West Bengal', zone: 'ER' },
    { code: 'MLDT', name: 'Malda Town', city: 'Malda', state: 'West Bengal', zone: 'ER' },
    { code: 'NJP', name: 'New Jalpaiguri Junction', city: 'Siliguri', state: 'West Bengal', zone: 'NFR' },
    { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR' },
    { code: 'PTK', name: 'Patliputra Junction', city: 'Patna', state: 'Bihar', zone: 'ECR' },
    { code: 'DNR', name: 'Danapur', city: 'Patna', state: 'Bihar', zone: 'ECR' },
    { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'ECR' },
    { code: 'MFP', name: 'Muzaffarpur Junction', city: 'Muzaffarpur', state: 'Bihar', zone: 'ECR' },
    { code: 'BJU', name: 'Barauni Junction', city: 'Barauni', state: 'Bihar', zone: 'ECR' },
    { code: 'DBG', name: 'Darbhanga Junction', city: 'Darbhanga', state: 'Bihar', zone: 'ECR' },
    { code: 'BGP', name: 'Bhagalpur Junction', city: 'Bhagalpur', state: 'Bihar', zone: 'ER' },
    { code: 'KIR', name: 'Katihar Junction', city: 'Katihar', state: 'Bihar', zone: 'NFR' },
    { code: 'MGS', name: 'Pt. Deen Dayal Upadhyaya Junction (Mughalsarai)', city: 'Pt DD Upadhyaya Nagar', state: 'Uttar Pradesh', zone: 'ECR' },
    { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand', zone: 'ECR' },
    { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi', state: 'Jharkhand', zone: 'SER' },
    { code: 'HTE', name: 'Hatia', city: 'Ranchi', state: 'Jharkhand', zone: 'SER' },
    { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand', zone: 'SER' },
    { code: 'BKSC', name: 'Bokaro Steel City', city: 'Bokaro', state: 'Jharkhand', zone: 'SER' },
    { code: 'JSG', name: 'Jharsuguda Junction', city: 'Jharsuguda', state: 'Odisha', zone: 'SER' },
    { code: 'ROU', name: 'Rourkela Junction', city: 'Rourkela', state: 'Odisha', zone: 'SER' },

    // --- EAST COAST (ECoR) & SOUTH EAST CENTRAL (SECR) ---
    { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR' },
    { code: 'CTC', name: 'Cuttack Junction', city: 'Cuttack', state: 'Odisha', zone: 'ECoR' },
    { code: 'PURI', name: 'Puri Terminus', city: 'Puri', state: 'Odisha', zone: 'ECoR' },
    { code: 'BAM', name: 'Brahmapur', city: 'Brahmapur', state: 'Odisha', zone: 'ECoR' },
    { code: 'SBP', name: 'Sambalpur Junction', city: 'Sambalpur', state: 'Odisha', zone: 'ECoR' },
    { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', zone: 'ECoR' },
    { code: 'VZM', name: 'Vizianagaram Junction', city: 'Vizianagaram', state: 'Andhra Pradesh', zone: 'ECoR' },
    { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'SECR' },
    { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', zone: 'SECR' },
    { code: 'DURG', name: 'Durg Junction', city: 'Durg', state: 'Chhattisgarh', zone: 'SECR' },

    // --- SOUTH CENTRAL (SCR) & SOUTHERN RAILWAY (SR) ---
    { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
    { code: 'HYB', name: 'Hyderabad Deccan Nampally', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
    { code: 'KCG', name: 'Kacheguda', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
    { code: 'KZJ', name: 'Kazipet Junction', city: 'Warangal', state: 'Telangana', zone: 'SCR' },
    { code: 'WL', name: 'Warangal', city: 'Warangal', state: 'Telangana', zone: 'SCR' },
    { code: 'VZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'GNT', name: 'Guntur Junction', city: 'Guntur', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'RJY', name: 'Rajahmundry', city: 'Rajahmundry', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'TPTY', name: 'Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'RU', name: 'Renigunta Junction', city: 'Tirupati', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'KRN', name: 'Kurnool City', city: 'Kurnool', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'NLR', name: 'Nellore', city: 'Nellore', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'OGL', name: 'Ongole', city: 'Ongole', state: 'Andhra Pradesh', zone: 'SCR' },
    { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'TBM', name: 'Tambaram', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'TPJ', name: 'Tiruchchirappalli Junction', city: 'Tiruchirappalli', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'SA', name: 'Salem Junction', city: 'Salem', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'ED', name: 'Erode Junction', city: 'Erode', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'TEN', name: 'Tirunelveli Junction', city: 'Tirunelveli', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'CAPE', name: 'Kanniyakumari', city: 'Kanyakumari', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'RMM', name: 'Rameswaram', city: 'Rameswaram', state: 'Tamil Nadu', zone: 'SR' },
    { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR' },
    { code: 'ERS', name: 'Ernakulam Junction (South)', city: 'Kochi', state: 'Kerala', zone: 'SR' },
    { code: 'ERN', name: 'Ernakulam Town (North)', city: 'Kochi', state: 'Kerala', zone: 'SR' },
    { code: 'CLT', name: 'Kozhikode Main (Calicut)', city: 'Kozhikode', state: 'Kerala', zone: 'SR' },
    { code: 'TCR', name: 'Thrissur', city: 'Thrissur', state: 'Kerala', zone: 'SR' },
    { code: 'PGT', name: 'Palakkad Junction', city: 'Palakkad', state: 'Kerala', zone: 'SR' },
    { code: 'CAN', name: 'Kannur', city: 'Kannur', state: 'Kerala', zone: 'SR' },
    { code: 'QLN', name: 'Kollam Junction', city: 'Kollam', state: 'Kerala', zone: 'SR' },
    { code: 'ALLP', name: 'Alappuzha', city: 'Alappuzha', state: 'Kerala', zone: 'SR' },
    { code: 'KTYM', name: 'Kottayam', city: 'Kottayam', state: 'Kerala', zone: 'SR' },

    // --- SOUTH WESTERN (SWR) ---
    { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
    { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
    { code: 'SMVB', name: 'Sir M. Visvesvaraya Terminal Bengaluru', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
    { code: 'BNC', name: 'Bengaluru Cantt', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
    { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', zone: 'SWR' },
    { code: 'UBL', name: 'SSS Hubballi Junction', city: 'Hubballi', state: 'Karnataka', zone: 'SWR' },
    { code: 'BGM', name: 'Belagavi', city: 'Belagavi', state: 'Karnataka', zone: 'SWR' },
    { code: 'MAQ', name: 'Mangaluru Central', city: 'Mangaluru', state: 'Karnataka', zone: 'SR' },
    { code: 'MAJN', name: 'Mangaluru Junction', city: 'Mangaluru', state: 'Karnataka', zone: 'SR' },
    { code: 'BAY', name: 'Ballari Junction', city: 'Ballari', state: 'Karnataka', zone: 'SWR' },
    { code: 'HPT', name: 'Hosapete Junction (Hampi)', city: 'Hosapete', state: 'Karnataka', zone: 'SWR' },
    { code: 'DVG', name: 'Davangere', city: 'Davangere', state: 'Karnataka', zone: 'SWR' },
    { code: 'KLBG', name: 'Kalaburagi (Gulbarga)', city: 'Kalaburagi', state: 'Karnataka', zone: 'CR' },

    // --- NORTHEAST FRONTIER (NFR) & NORTHEAST STATES ---
    { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR' },
    { code: 'KYQ', name: 'Kamakhya Junction', city: 'Guwahati', state: 'Assam', zone: 'NFR' },
    { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh', state: 'Assam', zone: 'NFR' },
    { code: 'SCL', name: 'Silchar', city: 'Silchar', state: 'Assam', zone: 'NFR' },
    { code: 'AGTL', name: 'Agartala', city: 'Agartala', state: 'Tripura', zone: 'NFR' },
    { code: 'DMV', name: 'Dimapur', city: 'Dimapur', state: 'Nagaland', zone: 'NFR' },
    { code: 'NHLN', name: 'Naharlagun (Itanagar)', city: 'Naharlagun', state: 'Arunachal Pradesh', zone: 'NFR' }
];

async function seedAllStations() {
    console.log(`🚀 Adding ${allIndiaStations.length} All-India Railway Stations...`);

    let addedCount = 0;
    let updatedCount = 0;

    for (const s of allIndiaStations) {
        const [res] = await db.query(`
            INSERT INTO stations (station_code, station_name, city, state, zone)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                station_name = VALUES(station_name),
                city = VALUES(city),
                state = VALUES(state),
                zone = VALUES(zone)
        `, [s.code, s.name, s.city, s.state, s.zone]);

        if (res.affectedRows === 1) addedCount++;
        else if (res.affectedRows === 2) updatedCount++;
    }

    const [totalRows] = await db.query('SELECT COUNT(*) as total FROM stations');
    console.log(`✅ Success! Added ${addedCount} new, updated ${updatedCount}. Total stations now in database: ${totalRows[0].total}`);
    process.exit(0);
}

seedAllStations().catch(err => {
    console.error('❌ Error adding stations:', err);
    process.exit(1);
});
