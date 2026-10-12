-- ============================================================
-- Railway Ticket Reservation & Journey Management System
-- MySQL Database Schema
-- ============================================================

DROP DATABASE IF EXISTS railway_db;
CREATE DATABASE railway_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway_db;

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================
CREATE TABLE users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    phone         VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('passenger','admin') DEFAULT 'passenger',
    gender        ENUM('Male','Female','Other') DEFAULT 'Male',
    dob           DATE,
    address       TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- STATIONS
-- ============================================================
CREATE TABLE stations (
    station_id   INT AUTO_INCREMENT PRIMARY KEY,
    station_code VARCHAR(10) UNIQUE NOT NULL,
    station_name VARCHAR(150) NOT NULL,
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    zone         VARCHAR(50),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRAINS
-- ============================================================
CREATE TABLE trains (
    train_id     INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10) UNIQUE NOT NULL,
    train_name   VARCHAR(150) NOT NULL,
    train_type   ENUM('Express','Superfast','Local','Rajdhani','Shatabdi','Duronto','Garib Rath','Jan Shatabdi') NOT NULL,
    total_seats  INT NOT NULL DEFAULT 0,
    status       ENUM('Active','Inactive','Under Maintenance') DEFAULT 'Active',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRAIN CLASSES & SEATS
-- ============================================================
CREATE TABLE train_classes (
    class_id    INT AUTO_INCREMENT PRIMARY KEY,
    train_id    INT NOT NULL,
    class_code  ENUM('1A','2A','3A','SL','CC','2S','FC','EC') NOT NULL,
    class_name  VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL DEFAULT 0,
    fare_per_km DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE KEY uq_train_class (train_id, class_code)
);

-- ============================================================
-- ROUTES & SCHEDULES
-- ============================================================
CREATE TABLE routes (
    route_id     INT AUTO_INCREMENT PRIMARY KEY,
    train_id     INT NOT NULL,
    station_id   INT NOT NULL,
    sequence_no  INT NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    distance_from_origin DECIMAL(10,2) DEFAULT 0,
    platform_no  INT DEFAULT 1,
    halt_duration_min INT DEFAULT 0,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES stations(station_id),
    UNIQUE KEY uq_route_sequence (train_id, sequence_no)
);

-- ============================================================
-- TRAIN SCHEDULES (Run days)
-- ============================================================
CREATE TABLE train_schedule (
    schedule_id  INT AUTO_INCREMENT PRIMARY KEY,
    train_id     INT NOT NULL,
    runs_on_mon  TINYINT(1) DEFAULT 1,
    runs_on_tue  TINYINT(1) DEFAULT 1,
    runs_on_wed  TINYINT(1) DEFAULT 1,
    runs_on_thu  TINYINT(1) DEFAULT 1,
    runs_on_fri  TINYINT(1) DEFAULT 1,
    runs_on_sat  TINYINT(1) DEFAULT 1,
    runs_on_sun  TINYINT(1) DEFAULT 1,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE
);

-- ============================================================
-- SEAT AVAILABILITY (per train, per class, per date)
-- ============================================================
CREATE TABLE seat_availability (
    avail_id        INT AUTO_INCREMENT PRIMARY KEY,
    train_id        INT NOT NULL,
    class_id        INT NOT NULL,
    journey_date    DATE NOT NULL,
    available_seats INT NOT NULL DEFAULT 0,
    rac_seats       INT NOT NULL DEFAULT 0,
    waitlist_count  INT NOT NULL DEFAULT 0,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES train_classes(class_id) ON DELETE CASCADE,
    UNIQUE KEY uq_avail (train_id, class_id, journey_date)
);

-- ============================================================
-- BOOKINGS / TICKETS
-- ============================================================
CREATE TABLE bookings (
    booking_id      INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number      VARCHAR(12) UNIQUE NOT NULL,
    user_id         INT NOT NULL,
    train_id        INT NOT NULL,
    class_id        INT NOT NULL,
    from_station_id INT NOT NULL,
    to_station_id   INT NOT NULL,
    journey_date    DATE NOT NULL,
    booking_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_fare      DECIMAL(10,2) NOT NULL,
    status          ENUM('Confirmed','RAC','Waitlisted','Cancelled','Completed') DEFAULT 'Confirmed',
    payment_status  ENUM('Paid','Pending','Refunded') DEFAULT 'Paid',
    payment_mode    ENUM('Credit Card','Debit Card','UPI','Net Banking','Wallet') DEFAULT 'UPI',
    transaction_id  VARCHAR(50),
    cancellation_reason TEXT,
    cancelled_at    TIMESTAMP NULL,
    refund_amount   DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (class_id) REFERENCES train_classes(class_id),
    FOREIGN KEY (from_station_id) REFERENCES stations(station_id),
    FOREIGN KEY (to_station_id) REFERENCES stations(station_id)
);

-- ============================================================
-- PASSENGERS (per booking, can be multiple)
-- ============================================================
CREATE TABLE passengers (
    passenger_id   INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    age            INT NOT NULL,
    gender         ENUM('Male','Female','Other') NOT NULL,
    seat_number    VARCHAR(10),
    berth_type     ENUM('Lower','Middle','Upper','Side Lower','Side Upper','Window','Aisle') DEFAULT 'Lower',
    status         ENUM('Confirmed','RAC','Waitlisted','Cancelled') DEFAULT 'Confirmed',
    waitlist_number INT DEFAULT NULL,
    rac_number     INT DEFAULT NULL,
    id_type        ENUM('Aadhar','PAN','Passport','DL','Voter ID') DEFAULT 'Aadhar',
    id_number      VARCHAR(30),
    is_senior      TINYINT(1) DEFAULT 0,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- ============================================================
-- CANCELLATIONS
-- ============================================================
CREATE TABLE cancellations (
    cancel_id       INT AUTO_INCREMENT PRIMARY KEY,
    booking_id      INT NOT NULL,
    cancelled_by    INT NOT NULL,
    cancel_reason   TEXT,
    refund_amount   DECIMAL(10,2) NOT NULL,
    refund_status   ENUM('Initiated','Processed','Failed') DEFAULT 'Initiated',
    cancellation_charges DECIMAL(10,2) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (cancelled_by) REFERENCES users(user_id)
);

-- ============================================================
-- FARE CHART
-- ============================================================
CREATE TABLE fare_chart (
    fare_id       INT AUTO_INCREMENT PRIMARY KEY,
    train_id      INT NOT NULL,
    class_id      INT NOT NULL,
    from_station_id INT NOT NULL,
    to_station_id INT NOT NULL,
    base_fare     DECIMAL(10,2) NOT NULL,
    distance_km   DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (class_id) REFERENCES train_classes(class_id),
    FOREIGN KEY (from_station_id) REFERENCES stations(station_id),
    FOREIGN KEY (to_station_id) REFERENCES stations(station_id)
);

-- ============================================================
-- ADMIN LOGS
-- ============================================================
CREATE TABLE admin_logs (
    log_id      INT AUTO_INCREMENT PRIMARY KEY,
    admin_id    INT NOT NULL,
    action      VARCHAR(200) NOT NULL,
    table_name  VARCHAR(100),
    record_id   INT,
    details     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    notif_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    type        ENUM('Booking','Cancellation','Update','Alert','Promo') DEFAULT 'Booking',
    is_read     TINYINT(1) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================
-- VIEWS
-- ============================================================
CREATE OR REPLACE VIEW booking_details AS
SELECT 
    b.booking_id, b.pnr_number,
    u.full_name AS passenger_name, u.email, u.phone,
    t.train_number, t.train_name, t.train_type,
    tc.class_code, tc.class_name,
    fs.station_name AS from_station, fs.city AS from_city,
    ts.station_name AS to_station, ts.city AS to_city,
    b.journey_date, b.booking_date, b.total_fare,
    b.status AS booking_status, b.payment_status, b.payment_mode
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN trains t ON b.train_id = t.train_id
JOIN train_classes tc ON b.class_id = tc.class_id
JOIN stations fs ON b.from_station_id = fs.station_id
JOIN stations ts ON b.to_station_id = ts.station_id;

CREATE OR REPLACE VIEW train_route_view AS
SELECT 
    t.train_number, t.train_name, t.train_type, t.status AS train_status,
    s.station_code, s.station_name, s.city,
    r.sequence_no, r.arrival_time, r.departure_time,
    r.distance_from_origin, r.platform_no
FROM routes r
JOIN trains t ON r.train_id = t.train_id
JOIN stations s ON r.station_id = s.station_id
ORDER BY t.train_number, r.sequence_no;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================
DELIMITER //

CREATE PROCEDURE search_trains(
    IN p_from_station_id INT,
    IN p_to_station_id   INT,
    IN p_journey_date    DATE
)
BEGIN
    SELECT DISTINCT
        t.train_id, t.train_number, t.train_name, t.train_type, t.status,
        r1.departure_time AS departure, r2.arrival_time AS arrival,
        (r2.distance_from_origin - r1.distance_from_origin) AS distance_km
    FROM trains t
    JOIN routes r1 ON t.train_id = r1.train_id AND r1.station_id = p_from_station_id
    JOIN routes r2 ON t.train_id = r2.train_id AND r2.station_id = p_to_station_id
    WHERE r1.sequence_no < r2.sequence_no AND t.status = 'Active';
END //

CREATE PROCEDURE get_seat_availability(
    IN p_train_id     INT,
    IN p_journey_date DATE
)
BEGIN
    SELECT 
        tc.class_id, tc.class_code, tc.class_name, tc.total_seats,
        COALESCE(sa.available_seats, tc.total_seats) AS available_seats,
        COALESCE(sa.rac_seats, 0) AS rac_seats,
        COALESCE(sa.waitlist_count, 0) AS waitlist_count,
        tc.fare_per_km
    FROM train_classes tc
    LEFT JOIN seat_availability sa ON tc.class_id = sa.class_id 
        AND sa.train_id = p_train_id AND sa.journey_date = p_journey_date
    WHERE tc.train_id = p_train_id;
END //

CREATE PROCEDURE book_ticket(
    IN  p_user_id         INT,
    IN  p_train_id        INT,
    IN  p_class_id        INT,
    IN  p_from_station_id INT,
    IN  p_to_station_id   INT,
    IN  p_journey_date    DATE,
    IN  p_total_fare      DECIMAL(10,2),
    IN  p_payment_mode    VARCHAR(50),
    OUT p_pnr             VARCHAR(12),
    OUT p_booking_id      INT,
    OUT p_status          VARCHAR(20)
)
BEGIN
    DECLARE v_available INT DEFAULT 0;
    DECLARE v_rac       INT DEFAULT 0;
    DECLARE v_waitlist  INT DEFAULT 0;
    DECLARE v_total     INT DEFAULT 0;
    DECLARE v_booking_status VARCHAR(20);
    
    SET p_pnr = CONCAT(FLOOR(RAND() * 9000000000) + 1000000000, '');
    
    SELECT available_seats, rac_seats, waitlist_count
    INTO v_available, v_rac, v_waitlist
    FROM seat_availability
    WHERE train_id = p_train_id AND class_id = p_class_id AND journey_date = p_journey_date;
    
    IF v_available IS NULL THEN
        SELECT total_seats INTO v_total FROM train_classes WHERE class_id = p_class_id;
        SET v_available = v_total;
        INSERT INTO seat_availability (train_id, class_id, journey_date, available_seats, rac_seats, waitlist_count)
        VALUES (p_train_id, p_class_id, p_journey_date, v_total, 0, 0);
    END IF;
    
    IF v_available > 0 THEN
        SET v_booking_status = 'Confirmed';
        UPDATE seat_availability SET available_seats = available_seats - 1
        WHERE train_id = p_train_id AND class_id = p_class_id AND journey_date = p_journey_date;
    ELSEIF v_rac < 10 THEN
        SET v_booking_status = 'RAC';
        UPDATE seat_availability SET rac_seats = rac_seats + 1
        WHERE train_id = p_train_id AND class_id = p_class_id AND journey_date = p_journey_date;
    ELSE
        SET v_booking_status = 'Waitlisted';
        UPDATE seat_availability SET waitlist_count = waitlist_count + 1
        WHERE train_id = p_train_id AND class_id = p_class_id AND journey_date = p_journey_date;
    END IF;
    
    INSERT INTO bookings (pnr_number, user_id, train_id, class_id, from_station_id, to_station_id, journey_date, total_fare, status, payment_mode, transaction_id)
    VALUES (p_pnr, p_user_id, p_train_id, p_class_id, p_from_station_id, p_to_station_id, p_journey_date, p_total_fare, v_booking_status, p_payment_mode, UUID());
    
    SET p_booking_id = LAST_INSERT_ID();
    SET p_status = v_booking_status;
    
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (p_user_id, 'Booking Confirmed', CONCAT('Your PNR ', p_pnr, ' status: ', v_booking_status), 'Booking');
END //

CREATE PROCEDURE cancel_ticket(
    IN p_booking_id  INT,
    IN p_user_id     INT,
    IN p_reason      TEXT,
    OUT p_refund     DECIMAL(10,2)
)
BEGIN
    DECLARE v_fare        DECIMAL(10,2);
    DECLARE v_journey_date DATE;
    DECLARE v_days_left   INT;
    DECLARE v_charge_pct  DECIMAL(5,2);
    DECLARE v_charge      DECIMAL(10,2);
    
    SELECT total_fare, journey_date INTO v_fare, v_journey_date
    FROM bookings WHERE booking_id = p_booking_id;
    
    SET v_days_left = DATEDIFF(v_journey_date, CURDATE());
    
    IF v_days_left >= 48 THEN SET v_charge_pct = 0.25;
    ELSEIF v_days_left >= 12 THEN SET v_charge_pct = 0.50;
    ELSE SET v_charge_pct = 1.00;
    END IF;
    
    SET v_charge = v_fare * v_charge_pct;
    SET p_refund = v_fare - v_charge;
    
    UPDATE bookings 
    SET status = 'Cancelled', payment_status = 'Refunded', cancelled_at = NOW(),
        refund_amount = p_refund, cancellation_reason = p_reason
    WHERE booking_id = p_booking_id;
    
    INSERT INTO cancellations (booking_id, cancelled_by, cancel_reason, refund_amount, cancellation_charges)
    VALUES (p_booking_id, p_user_id, p_reason, p_refund, v_charge);
    
    INSERT INTO notifications (user_id, title, message, type)
    SELECT user_id, 'Booking Cancelled', CONCAT('Refund of Rs.', p_refund, ' initiated.'), 'Cancellation'
    FROM bookings WHERE booking_id = p_booking_id;
    
    UPDATE seat_availability sa
    JOIN bookings b ON sa.train_id = b.train_id AND sa.class_id = b.class_id AND sa.journey_date = b.journey_date
    SET sa.available_seats = sa.available_seats + 1
    WHERE b.booking_id = p_booking_id;
END //

DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================
DELIMITER //

CREATE TRIGGER trg_cancel_passengers
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        UPDATE passengers SET status = 'Cancelled' WHERE booking_id = NEW.booking_id;
    END IF;
END //

CREATE TRIGGER trg_log_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'New Booking', CONCAT('PNR: ', NEW.pnr_number, ' | Fare: Rs.', NEW.total_fare), 'Booking');
END //

DELIMITER ;

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Users: password for all is "admin123" (bcrypt hash)
INSERT INTO users (full_name, email, phone, password_hash, role, gender, dob) VALUES
('Railway Admin', 'admin@railway.com', '9000000001', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cjh6RnBWBu.QhQfAHNSXzuS', 'admin', 'Male', '1985-01-01'),
('Rahul Sharma', 'rahul@example.com', '9876543210', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cjh6RnBWBu.QhQfAHNSXzuS', 'passenger', 'Male', '1995-06-15'),
('Priya Singh', 'priya@example.com', '9876543211', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cjh6RnBWBu.QhQfAHNSXzuS', 'passenger', 'Female', '1998-03-22'),
('Amit Kumar', 'amit@example.com', '9876543212', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cjh6RnBWBu.QhQfAHNSXzuS', 'passenger', 'Male', '1990-11-10');

-- Stations
INSERT INTO stations (station_code, station_name, city, state, zone) VALUES
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi', 'Northern'),
('BCT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra', 'Western'),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 'Southern'),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 'Eastern'),
('SBC', 'Krantivira Sangolli Rayanna Station', 'Bengaluru', 'Karnataka', 'South Western'),
('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 'Western'),
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 'Northern'),
('LKO', 'Lucknow Charbagh', 'Lucknow', 'Uttar Pradesh', 'Northern'),
('HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana', 'South Central'),
('PNQ', 'Pune Junction', 'Pune', 'Maharashtra', 'Central'),
('CNB', 'Kanpur Central', 'Kanpur', 'Uttar Pradesh', 'Northern'),
('AGC', 'Agra Cantt', 'Agra', 'Uttar Pradesh', 'Northern'),
('GHY', 'Guwahati', 'Guwahati', 'Assam', 'Northeast Frontier'),
('BPL', 'Bhopal Junction', 'Bhopal', 'Madhya Pradesh', 'West Central'),
('NGP', 'Nagpur Junction', 'Nagpur', 'Maharashtra', 'Central'),
('SC', 'Secunderabad Junction', 'Hyderabad', 'Telangana', 'South Central'),
('UDZ', 'Udaipur City', 'Udaipur', 'Rajasthan', 'North Western'),
('JU', 'Jodhpur Junction', 'Jodhpur', 'Rajasthan', 'North Western'),
('PTK', 'Patna Junction', 'Patna', 'Bihar', 'Eastern'),
('VZA', 'Vijayawada Junction', 'Vijayawada', 'Andhra Pradesh', 'South Central');

-- Trains
INSERT INTO trains (train_number, train_name, train_type, total_seats, status) VALUES
('12301', 'Howrah Rajdhani Express', 'Rajdhani', 1040, 'Active'),
('12951', 'Mumbai Rajdhani Express', 'Rajdhani', 1040, 'Active'),
('12001', 'Bhopal Shatabdi Express', 'Shatabdi', 1150, 'Active'),
('22691', 'Bangalore Rajdhani Express', 'Rajdhani', 1040, 'Active'),
('12621', 'Tamil Nadu Express', 'Express', 1800, 'Active'),
('12259', 'Sealdah Duronto Express', 'Duronto', 1200, 'Active'),
('12245', 'Howrah Duronto Express', 'Duronto', 1100, 'Active'),
('12019', 'Ajmer Shatabdi Express', 'Shatabdi', 1100, 'Active'),
('19032', 'Haridwar Express', 'Express', 2000, 'Active'),
('12483', 'Amritsar Express', 'Express', 1800, 'Active');

-- Train Classes
INSERT INTO train_classes (train_id, class_code, class_name, total_seats, fare_per_km) VALUES
(1, '1A', 'AC First Class', 18, 5.50),
(1, '2A', 'AC Two Tier', 46, 3.15),
(1, '3A', 'AC Three Tier', 64, 2.10),
(1, 'SL', 'Sleeper Class', 72, 0.45),
(2, '1A', 'AC First Class', 18, 5.50),
(2, '2A', 'AC Two Tier', 46, 3.15),
(2, '3A', 'AC Three Tier', 64, 2.10),
(3, 'CC', 'AC Chair Car', 78, 1.80),
(3, 'EC', 'Executive Chair Car', 56, 3.00),
(4, '1A', 'AC First Class', 18, 5.50),
(4, '2A', 'AC Two Tier', 46, 3.15),
(4, '3A', 'AC Three Tier', 64, 2.10),
(5, '2A', 'AC Two Tier', 46, 3.15),
(5, '3A', 'AC Three Tier', 64, 2.10),
(5, 'SL', 'Sleeper Class', 72, 0.45),
(5, '2S', 'Second Seating', 108, 0.25),
(6, '1A', 'AC First Class', 18, 5.50),
(6, '2A', 'AC Two Tier', 46, 3.15),
(6, '3A', 'AC Three Tier', 64, 2.10),
(7, '2A', 'AC Two Tier', 46, 3.15),
(7, '3A', 'AC Three Tier', 64, 2.10),
(7, 'SL', 'Sleeper Class', 72, 0.45),
(8, 'CC', 'AC Chair Car', 78, 1.80),
(8, 'EC', 'Executive Chair Car', 56, 3.00),
(9, '3A', 'AC Three Tier', 64, 2.10),
(9, 'SL', 'Sleeper Class', 72, 0.45),
(9, '2S', 'Second Seating', 108, 0.25),
(10, '3A', 'AC Three Tier', 64, 2.10),
(10, 'SL', 'Sleeper Class', 72, 0.45),
(10, '2S', 'Second Seating', 108, 0.25);

-- Routes for Train 1 (Delhi -> Kanpur -> Lucknow -> Kolkata)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(1, 1, 1, NULL, '17:05:00', 0, 1),
(1, 11, 2, '22:10:00', '22:20:00', 440, 3),
(1, 8, 3, '00:15:00', '00:25:00', 512, 2),
(1, 4, 4, '09:55:00', NULL, 1441, 12);

-- Routes for Train 2 (Delhi -> Ahmedabad -> Mumbai)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(2, 1, 1, NULL, '16:35:00', 0, 2),
(2, 6, 2, '23:50:00', '00:05:00', 940, 5),
(2, 2, 3, '08:35:00', NULL, 1384, 1);

-- Routes for Train 3 (Delhi -> Agra -> Bhopal)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(3, 1, 1, NULL, '06:00:00', 0, 1),
(3, 12, 2, '08:00:00', '08:05:00', 196, 2),
(3, 14, 3, '14:00:00', NULL, 705, 1);

-- Routes for Train 4 (Delhi -> Nagpur -> Bangalore)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(4, 1, 1, NULL, '20:00:00', 0, 3),
(4, 14, 2, '05:45:00', '05:55:00', 705, 2),
(4, 15, 3, '12:05:00', '12:15:00', 1171, 3),
(4, 5, 4, '21:30:00', NULL, 2150, 4);

-- Routes for Train 5 (Delhi -> Bhopal -> Nagpur -> Hyderabad -> Chennai)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(5, 1, 1, NULL, '22:30:00', 0, 4),
(5, 14, 2, '06:00:00', '06:10:00', 705, 1),
(5, 15, 3, '12:45:00', '12:55:00', 1171, 3),
(5, 9, 4, '20:05:00', '20:20:00', 1661, 1),
(5, 3, 5, '07:10:00', NULL, 2180, 12);

-- Routes for Train 8 (Delhi -> Jaipur -> Jodhpur)
INSERT INTO routes (train_id, station_id, sequence_no, arrival_time, departure_time, distance_from_origin, platform_no) VALUES
(8, 1, 1, NULL, '06:05:00', 0, 2),
(8, 7, 2, '10:40:00', '10:45:00', 303, 3),
(8, 18, 3, '14:35:00', NULL, 600, 1);

-- Train Schedules
INSERT INTO train_schedule (train_id, runs_on_mon, runs_on_tue, runs_on_wed, runs_on_thu, runs_on_fri, runs_on_sat, runs_on_sun) VALUES
(1, 1, 1, 1, 1, 1, 1, 1),
(2, 1, 1, 1, 1, 1, 1, 1),
(3, 1, 1, 1, 1, 1, 1, 1),
(4, 1, 0, 1, 0, 1, 0, 1),
(5, 1, 1, 1, 1, 1, 1, 1),
(6, 1, 0, 0, 1, 0, 0, 1),
(7, 0, 1, 0, 1, 0, 1, 0),
(8, 1, 1, 1, 1, 1, 1, 1),
(9, 1, 0, 1, 0, 1, 0, 1),
(10, 1, 1, 0, 1, 0, 1, 1);

-- Fare Chart
INSERT INTO fare_chart (train_id, class_id, from_station_id, to_station_id, base_fare, distance_km) VALUES
(1, 1, 1, 4, 4510.00, 1441),
(1, 2, 1, 4, 2255.00, 1441),
(1, 3, 1, 4, 1465.00, 1441),
(1, 4, 1, 4, 390.00, 1441),
(2, 5, 1, 2, 3280.00, 1384),
(2, 6, 1, 2, 1985.00, 1384),
(2, 7, 1, 2, 1175.00, 1384),
(5, 13, 1, 3, 1260.00, 2180),
(5, 14, 1, 3, 940.00, 2180),
(5, 15, 1, 3, 390.00, 2180),
(5, 16, 1, 3, 210.00, 2180);
