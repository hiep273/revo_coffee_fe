CREATE DATABASE IF NOT EXISTS revo_products;
USE revo_products;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    type VARCHAR(50),
    region VARCHAR(100),
    process_method VARCHAR(100),
    roast_level VARCHAR(50),
    flavor_notes VARCHAR(255),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name, description) VALUES
('Whole Bean', 'Whole coffee beans for grinding at home'),
('Ground Coffee', 'Pre-ground coffee for convenience'),
('Specialty', 'Limited edition and single origin coffees'),
('Subscription', 'Monthly coffee subscription plans'),
('Gift Set', 'Curated coffee gift collections');

INSERT INTO products (id, name, description, price, category_id, type, region, process_method, roast_level, flavor_notes, image_url, stock, is_active) VALUES
('prod-001', 'Revo Dark Roast', 'Bold and intense dark roast with chocolate and caramel notes. Perfect for espresso lovers.', 9.99, 1, 'Whole Bean', 'Vietnam Central Highlands', 'Washed', 'Dark', 'Dark Chocolate, Caramel, Smoky', '/images/dark-roast.jpg', 150, TRUE),
('prod-002', 'Revo Medium Roast', 'Balanced and smooth medium roast with nutty and fruity undertones.', 8.99, 1, 'Whole Bean', 'Dalat, Vietnam', 'Natural', 'Medium', 'Hazelnut, Red Apple, Honey', '/images/medium-roast.jpg', 120, TRUE),
('prod-003', 'Revo Light Roast', 'Bright and floral light roast highlighting the bean\'s origin characteristics.', 10.49, 1, 'Whole Bean', 'Ethiopia Yirgacheffe', 'Washed', 'Light', 'Jasmine, Lemon, Bergamot', '/images/light-roast.jpg', 80, TRUE),
('prod-004', 'Revo Espresso Blend', 'Specially crafted blend for rich, crema-topped espresso shots.', 11.99, 2, 'Ground', 'Vietnam & Brazil', 'Mixed', 'Medium-Dark', 'Cocoa, Almond, Brown Sugar', '/images/espresso-blend.jpg', 200, TRUE),
('prod-005', 'Revo Cold Brew', 'Coarse ground optimized for cold brew extraction. Smooth and low acidity.', 8.49, 2, 'Ground', 'Vietnam', 'Natural', 'Medium', 'Chocolate, Cherry, Vanilla', '/images/cold-brew.jpg', 90, TRUE),
('prod-006', 'Single Origin Buon Ma Thuot', 'Premium single origin from the coffee capital of Vietnam.', 14.99, 3, 'Whole Bean', 'Buon Ma Thuot', 'Honey Process', 'Medium', 'Tropical Fruit, Honey, Spice', '/images/buon-ma-thuot.jpg', 50, TRUE),
('prod-007', 'Monthly Discovery Box', '3 bags of rotating single origins delivered monthly.', 29.99, 4, 'Subscription', 'Various', 'Various', 'Various', 'Surprise flavors every month', '/images/discovery-box.jpg', 1000, TRUE),
('prod-008', 'Barista Starter Kit', 'Perfect gift for coffee beginners: 2 bags + brewing guide.', 24.99, 5, 'Gift Set', 'Vietnam', 'Mixed', 'Mixed', 'Chocolate, Nut, Fruit', '/images/starter-kit.jpg', 75, TRUE);

