CREATE DATABASE IF NOT EXISTS revo_inventory;
USE revo_inventory;

CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255),
    quantity_available INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    warehouse_location VARCHAR(100),
    reorder_level INT DEFAULT 20,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    movement_type ENUM('in', 'out', 'reserve', 'release', 'adjustment') NOT NULL,
    reference_id VARCHAR(100),
    reference_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO inventory_items (product_id, product_name, quantity_available, quantity_reserved, warehouse_location, reorder_level) VALUES
('prod-001', 'Revo Dark Roast', 150, 10, 'WH-A1-S1', 30),
('prod-002', 'Revo Medium Roast', 120, 5, 'WH-A1-S2', 25),
('prod-003', 'Revo Light Roast', 80, 8, 'WH-A1-S3', 20),
('prod-004', 'Revo Espresso Blend', 200, 15, 'WH-A2-S1', 40),
('prod-005', 'Revo Cold Brew', 90, 3, 'WH-A2-S2', 15),
('prod-006', 'Single Origin Buon Ma Thuot', 50, 2, 'WH-B1-S1', 10),
('prod-007', 'Monthly Discovery Box', 1000, 50, 'WH-C1-S1', 100),
('prod-008', 'Barista Starter Kit', 75, 5, 'WH-C1-S2', 15);

INSERT INTO stock_movements (product_id, quantity, movement_type, reference_id, reference_type, notes) VALUES
('prod-001', 200, 'in', 'PO-2024-001', 'purchase_order', 'Initial stock receipt'),
('prod-002', 150, 'in', 'PO-2024-001', 'purchase_order', 'Initial stock receipt'),
('prod-001', 10, 'reserve', 'ORD-1001', 'order', 'Order reservation'),
('prod-004', 15, 'reserve', 'ORD-1002', 'order', 'Order reservation'),
('prod-007', 50, 'reserve', 'SUB-001', 'subscription', 'Monthly subscription reservation');

