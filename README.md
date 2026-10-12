# RailConnect — Railway Ticket Reservation & Journey Management System

A full-stack Railway Reservation & Journey Management System built for Database Management Systems (DBMS) using **MySQL**, **Node.js/Express**, and a modern **Vanilla HTML5/CSS3/JavaScript** frontend with rich dark-mode aesthetics.

---

## 🌟 Key Features

### 👤 Passenger Portal (`/` or `index.html`)
- **Live Train Search**: Search trains between any source and destination station on chosen journey dates.
- **Quota & Class Selection**: General, Tatkal, Ladies quotas with 1A, 2A, 3A, SL, CC tiers.
- **Seat Availability & Status Engine**: Automatic status allocation: `Confirmed`, `RAC`, or `Waitlisted` according to quota thresholds.
- **Interactive Multi-Passenger Booking**: Add multiple passengers per booking with auto-assigned seat/berth numbers and fare calculation.
- **Instant PNR Status Checker**: Query real-time status of any 10-digit PNR with passenger itinerary & confirmation details.
- **Journey & Ticket Cancellation**: Instant cancellation with automatic cancellation charge calculation and refund calculation.
- **User Dashboard & Booking History**: View upcoming journeys, download tickets, track booking status.
- **Live Train Schedules & Routes**: Search train routes, intermediate stops, arrival/departure timings, and platform numbers.

### 🛡️ Admin Management Portal (`/admin.html`)
- **Analytics Dashboard**: Total bookings, confirmed count, revenue metrics, waitlisted passengers, and monthly revenue charts.
- **Booking Management**: Filter, search, and cancel bookings with refund tracking.
- **Train Management**: Add new trains, update statuses (Active/Maintenance), and configure capacities.
- **Station Management**: Add new stations with codes, cities, states, and railway zones.
- **Passenger Directory**: View all registered users, total spending, and reservation counts.
- **Audit Logs**: Log tracking for administrative actions (add/update/delete).

---

## 🗄️ Database Architecture (MySQL)

The database schema (`database/schema.sql`) contains:
- `users`: User profiles, credentials (hashed), role management (`passenger`, `admin`).
- `stations`: Railway stations with codes, cities, states, and zones.
- `trains`: Train information, train types, total capacity, and active status.
- `train_classes`: Tiers (`1A`, `2A`, `3A`, `SL`, `CC`) and fare per kilometer rates.
- `routes`: Intermediate stops, halt durations, platform assignments, and distances from origin.
- `train_schedule`: Weekly operational days (Mon-Sun).
- `bookings`: Reservations, 10-digit PNR numbers, journey dates, total fares, and statuses.
- `passengers`: Passenger details tied to bookings, age, gender, berth preferences, and allocated seat numbers.
- `payments`: Transaction records, payment modes (UPI, Card, Net Banking), and transaction statuses.
- `cancellations`: Cancellation logs with cancellation charges and refund amounts.
- `admin_logs`: Security and administrative action audit trails.
- **Sample Seed Data**: Includes 10 stations across India, 8 famous express/Rajdhani trains, complete route schedules, and demo users.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js** (v16+)
- **MySQL Server** (v8.0+ or MariaDB)

### 2. Configure Database
1. Open MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Import the schema and seed data:
   ```sql
   SOURCE database/schema.sql;
   ```
   *(Or copy-paste the contents of [schema.sql](file:///c:/Users/psidd/Downloads/dbms%20project/database/schema.sql) into MySQL Workbench/phpMyAdmin)*

### 3. Configure Environment Variables
Edit [.env](file:///c:/Users/psidd/Downloads/dbms%20project/.env) with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=railway_db
DB_PORT=3306

JWT_SECRET=railway_super_secret_jwt_key_2024
PORT=3000
```

### 4. Start the Application
```bash
npm start
```
The server will start at:
- **Passenger Portal**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin.html`

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@railway.com` | `admin123` |
| **Demo User** | `rahul@gmail.com` | `rahul123` |
| **Demo User** | `priya@gmail.com` | `priya123` |
