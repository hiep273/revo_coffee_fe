CREATE DATABASE IF NOT EXISTS revo_orders;
USE revo_orders;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    user_email VARCHAR(255),
    user_name VARCHAR(255),
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_address TEXT,
    shipping_phone VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO orders (order_code, user_id, user_email, user_name, status, total_amount, shipping_address, shipping_phone, payment_method, payment_status, notes) VALUES
('ORD-2024-1001', 2, 'customer1@example.com', 'Nguyen Van A', 'confirmed', 28.97, '456 Bean Rd, District 3, HCMC', '0909876543', 'cod', 'pending', 'Please deliver in the morning'),
('ORD-2024-1002', 3, 'customer2@example.com', 'Tran Thi B', 'shipped', 11.99, '789 Roast Ave, District 5, HCMC', '0912345678', 'bank_transfer', 'paid', 'Gift wrap please'),
('ORD-2024-1003', 2, 'customer1@example.com', 'Nguyen Van A', 'pending', 19.98, '456 Bean Rd, District 3, HCMC', '0909876543', 'cod', 'pending', NULL),
('ORD-2024-1004', 4, 'customer3@example.com', 'Le Van C', 'delivered', 45.98, '321 Brew Blvd, District 7, HCMC', '0923456789', 'momo', 'paid', 'Leave at reception');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES
(1, 'prod-001', 'Revo Dark Roast', 2, 9.99, 19.98),
(1, 'prod-005', 'Revo Cold Brew', 1, 8.99, 8.99),
(2, 'prod-004', 'Revo Espresso Blend', 1, 11.99, 11.99),
(3, 'prod-002', 'Revo Medium Roast', 2, 8.99, 17.98),
(3, 'prod-005', 'Revo Cold Brew', 1, 1.00, 2.00),
(4, 'prod-006', 'Single Origin Buon Ma Thuot', 2, 14.99, 29.98),
(4, 'prod-008', 'Barista Starter Kit', 1, 15.99, 15.99);

