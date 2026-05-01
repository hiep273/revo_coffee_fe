CREATE DATABASE IF NOT EXISTS revo_identity;
USE revo_identity;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    loyalty_points INT DEFAULT 0,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seeded accounts use password: password
INSERT INTO users (full_name, email, password_hash, role, loyalty_points, phone, address) VALUES
('Admin Revo', 'admin@revo.coffee', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 0, '0901234567', '123 Coffee St, District 1, HCMC'),
('Nguyen Van A', 'customer1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 24, '0909876543', '456 Bean Rd, District 3, HCMC'),
('Tran Thi B', 'customer2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 12, '0912345678', '789 Roast Ave, District 5, HCMC'),
('Le Van C', 'customer3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 8, '0923456789', '321 Brew Blvd, District 7, HCMC');

INSERT INTO addresses (user_id, address_line, city, district, is_default) VALUES
(2, '456 Bean Rd', 'HCMC', 'District 3', TRUE),
(3, '789 Roast Ave', 'HCMC', 'District 5', TRUE),
(4, '321 Brew Blvd', 'HCMC', 'District 7', TRUE);
