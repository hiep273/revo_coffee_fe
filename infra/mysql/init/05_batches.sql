CREATE DATABASE IF NOT EXISTS revo_batches;
USE revo_batches;

CREATE TABLE IF NOT EXISTS batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_code VARCHAR(50) NOT NULL UNIQUE,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    roast_date DATE NOT NULL,
    roast_level VARCHAR(50),
    origin_region VARCHAR(100),
    process_method VARCHAR(100),
    notes TEXT,
    status ENUM('roasting', 'cooling', 'quality_check', 'packaging', 'completed', 'rejected') DEFAULT 'roasting',
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS batch_quality_checks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    check_date DATE NOT NULL,
    moisture_content DECIMAL(5, 2),
    bean_density DECIMAL(6, 2),
    color_score INT,
    defect_count INT DEFAULT 0,
    aroma_notes TEXT,
    passed BOOLEAN DEFAULT FALSE,
    checked_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO batches (batch_code, product_id, product_name, quantity, roast_date, roast_level, origin_region, process_method, notes, status, created_by) VALUES
('BT-2024-001', 'prod-001', 'Revo Dark Roast', 500, '2024-01-15', 'Dark', 'Vietnam Central Highlands', 'Washed', 'First batch of 2024. Slower roast profile for deeper caramelization.', 'completed', 'Roaster A'),
('BT-2024-002', 'prod-002', 'Revo Medium Roast', 400, '2024-01-16', 'Medium', 'Dalat, Vietnam', 'Natural', 'Standard medium profile. Good weather conditions during drying.', 'completed', 'Roaster B'),
('BT-2024-003', 'prod-001', 'Revo Dark Roast', 300, '2024-01-20', 'Dark', 'Vietnam Central Highlands', 'Washed', 'Experimental longer development time.', 'quality_check', 'Roaster A'),
('BT-2024-004', 'prod-003', 'Revo Light Roast', 250, '2024-01-18', 'Light', 'Ethiopia Yirgacheffe', 'Washed', 'Very delicate handling required. Low charge temperature.', 'packaging', 'Roaster C'),
('BT-2024-005', 'prod-006', 'Single Origin Buon Ma Thuot', 200, '2024-01-22', 'Medium', 'Buon Ma Thuot', 'Honey Process', 'Premium lot. Honey process creates natural sweetness.', 'roasting', 'Roaster A');

INSERT INTO batch_quality_checks (batch_id, check_date, moisture_content, bean_density, color_score, defect_count, aroma_notes, passed, checked_by, notes) VALUES
(1, '2024-01-16', 3.2, 0.72, 85, 2, 'Rich chocolate, caramel, slight smoky', TRUE, 'QC Inspector 1', 'Excellent batch. Within all specs.'),
(2, '2024-01-17', 3.5, 0.70, 80, 3, 'Nutty, fruity, balanced sweetness', TRUE, 'QC Inspector 2', 'Good uniformity. Minor chaff issue.'),
(3, '2024-01-21', 3.1, 0.74, 88, 1, 'Deep chocolate, molasses, smoky', TRUE, 'QC Inspector 1', 'Still cooling. Initial readings good.'),
(4, '2024-01-19', 4.0, 0.68, 75, 0, 'Floral, citrus, tea-like', TRUE, 'QC Inspector 3', 'Exceptional clarity. Very clean cup.'),
(5, '2024-01-23', 3.8, 0.71, 82, 4, 'Tropical fruit, honey, spice', FALSE, 'QC Inspector 2', 'Too many quakers detected. Re-roast required.');

