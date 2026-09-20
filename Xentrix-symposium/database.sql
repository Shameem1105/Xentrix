-- ====================================================
-- ZENTRIX '26 Database Schema for MySQL / phpMyAdmin
-- Database Name: zentrix26_db
-- ====================================================

CREATE DATABASE IF NOT EXISTS zentrix26_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zentrix26_db;

-- 1. Main Registrations Table (Includes QR Pass Token & Gate Verification Audit)
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(30) UNIQUE NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study VARCHAR(20) NOT NULL,
    leader_name VARCHAR(100) NOT NULL,
    leader_email VARCHAR(120) NOT NULL,
    leader_phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Completed',
    qr_token VARCHAR(64) UNIQUE NOT NULL,
    qr_used TINYINT(1) DEFAULT 0,
    qr_generated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qr_used_time DATETIME NULL,
    scanned_by VARCHAR(100) NULL,
    scan_location VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reg_id (registration_id),
    INDEX idx_leader_email (leader_email),
    INDEX idx_leader_phone (leader_phone),
    INDEX idx_qr_token (qr_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(30) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    member_email VARCHAR(120),
    member_phone VARCHAR(20),
    member_qr_token VARCHAR(64) UNIQUE NULL,
    member_qr_used TINYINT(1) DEFAULT 0,
    member_qr_used_time DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Registered Events Junction Table
CREATE TABLE IF NOT EXISTS registered_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(30) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    category ENUM('Technical', 'Non-Technical') NOT NULL,
    event_fee DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES registrations(registration_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Admins & Super Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pre-populate Default Super Admin & Admin (Passwords hashed with MD5/SHA256 for demo compatibility)
INSERT INTO admins (username, password_hash, role) VALUES 
('superadmin', 'c25091c53e839e5572074e443eb5441d', 'super_admin'), -- password: supersecret
('admin', '0192023a7bbd73250516f069df18b500', 'admin')           -- password: admin123
ON DUPLICATE KEY UPDATE role=VALUES(role);

-- 5. Master Events Table
CREATE TABLE IF NOT EXISTS events_master (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('Technical', 'Non-Technical') NOT NULL,
    team_size VARCHAR(50) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    prize_pool DECIMAL(10,2) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(100) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Pre-populate events_master data
INSERT INTO events_master (id, name, category, team_size, fee, prize_pool, start_time, end_time, venue, description) VALUES
('paper-pres', 'Paper Presentation', 'Technical', '1-4 Members', 300.00, 6000.00, '09:30:00', '12:30:00', 'Seminar Hall 1', 'Present original technical research papers in IEEE format.'),
('mega-proj', 'Mega Project Exhibition', 'Technical', '2-4 Members', 400.00, 6000.00, '09:30:00', '13:00:00', 'Innovation Hall', 'Showcase working hardware prototypes, IoT devices, and robotics.'),
('tinker-lab', 'Tinkerer''s Lab Workshop', 'Technical', '1-2 Members', 250.00, 0.00, '09:00:00', '12:00:00', 'Mechanical Workshop', 'Hands-on practical session on rapid product prototyping.'),
('labview-ws', 'Hands-on LabVIEW Workshop', 'Technical', '1-2 Members', 250.00, 3750.00, '09:00:00', '12:00:00', 'ECE Simulation Lab', 'System design & virtual instrumentation session.'),
('tech-quiz', 'Technical Quiz', 'Technical', '2 Members', 200.00, 3750.00, '10:00:00', '11:30:00', 'ECE Seminar Room', 'Buzzer battle testing core engineering & tech concepts.'),
('circuit-debug', 'Circuit Debugging', 'Technical', '2 Members', 200.00, 3750.00, '11:30:00', '13:00:00', 'EEE Hardware Lab', 'Troubleshoot analog/digital circuits & replace faulty ICs.'),
('cad-design', 'CAD Design Contest', 'Technical', '1 Member', 200.00, 3750.00, '09:30:00', '11:30:00', 'CAD / CAM Lab', 'Create 3D mechanical components & isometric assemblies.'),
('robo-race', 'Robo Race', 'Technical', '2-4 Members', 350.00, 10000.00, '10:30:00', '13:00:00', 'Outdoor Amphitheatre', 'High-speed obstacle track race for custom bots.'),
('hackathon', 'Hackathon (4 Hours)', 'Technical', '2-4 Members', 400.00, 6000.00, '09:00:00', '13:00:00', 'Main Computer Center', 'Non-stop 4-hour software/hardware challenge.'),
('escape-room', 'Escape Room', 'Non-Technical', '2-4 Members', 200.00, 1500.00, '14:00:00', '16:00:00', 'Block C Room 204', 'Solve puzzles & decrypt hidden clues to escape within 15 mins.'),
('bgmi', 'BGMI Tournament', 'Non-Technical', '4 Members', 200.00, 1500.00, '14:00:00', '17:00:00', 'Esports Arena', 'Squad battle royale on Erangel and Miramar maps.'),
('valorant', 'Valorant Tournament', 'Non-Technical', '5 Members', 250.00, 1500.00, '14:00:00', '17:30:00', 'High-End Gaming Lab', '5v5 tactical FPS elimination bracket on 144Hz PCs.'),
('freefire', 'Free Fire Tournament', 'Non-Technical', '4 Members', 200.00, 1500.00, '14:00:00', '16:30:00', 'Block B Room 102', 'Squad survival match on custom Bermuda lobbies.'),
('fun-fusion', 'Fun Fusion Carnival', 'Non-Technical', '1-2 Members', 150.00, 1500.00, '14:30:00', '16:30:00', 'College Courtyard', 'Carnival games, stack attack, reaction speed tests.'),
('jam', 'Just A Minute (JAM)', 'Non-Technical', '1 Member', 100.00, 1500.00, '14:00:00', '15:30:00', 'Seminar Hall 2', 'Speak fluently on spot topic without hesitation.'),
('photography', 'Photography', 'Non-Technical', '1 Member', 100.00, 1500.00, '14:00:00', '17:00:00', 'Campus Grounds', 'Capture campus moments under theme of "Engineering in Motion".')
ON DUPLICATE KEY UPDATE name=VALUES(name), fee=VALUES(fee), prize_pool=VALUES(prize_pool);
