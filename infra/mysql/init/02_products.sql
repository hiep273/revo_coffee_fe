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
    price DECIMAL(12, 2) NOT NULL,
    category_id INT,
    type VARCHAR(50),
    region VARCHAR(100),
    altitude VARCHAR(50),
    process_method VARCHAR(100),
    processing_method VARCHAR(100),
    roast_level VARCHAR(50) NOT NULL,
    flavor_notes VARCHAR(255),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS flavor_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_flavor_notes (
    product_id VARCHAR(36) NOT NULL,
    flavor_note_id INT NOT NULL,
    PRIMARY KEY (product_id, flavor_note_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (flavor_note_id) REFERENCES flavor_notes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS grind_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_grind_sizes (
    product_id VARCHAR(36) NOT NULL,
    grind_size_id INT NOT NULL,
    PRIMARY KEY (product_id, grind_size_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (grind_size_id) REFERENCES grind_sizes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categories (name, description) VALUES
('Whole Bean', 'Whole coffee beans for grinding at home'),
('Ground Coffee', 'Pre-ground coffee for convenience'),
('Specialty', 'Limited edition and single origin coffees'),
('Subscription', 'Coffee subscription plans'),
('Gift Set', 'Curated coffee gift collections');

INSERT INTO products (id, name, description, price, category_id, type, region, altitude, process_method, processing_method, roast_level, flavor_notes, image_url, stock, is_active) VALUES
('prod-001', 'Revo Dark Roast', 'Bold and intense dark roast with chocolate and caramel notes. Perfect for espresso lovers.', 9.99, 1, 'robusta', 'daklak', '800m', 'Washed', 'Washed', 'dark', 'Dark Chocolate, Caramel, Smoky', '/images/product-001.png', 150, TRUE),
('prod-002', 'Revo Medium Roast', 'Balanced and smooth medium roast with nutty and fruity undertones.', 8.99, 1, 'arabica', 'dalat', '1500m', 'Natural', 'Natural', 'medium', 'Hazelnut, Red Apple, Honey', '/images/product-002.png', 120, TRUE),
('prod-003', 'Revo Light Roast', 'Bright and floral light roast highlighting the bean origin characteristics.', 10.49, 1, 'arabica', 'ethiopia', '1900m', 'Washed', 'Washed', 'light', 'Jasmine, Lemon, Bergamot', '/images/product-003.png', 80, TRUE),
('prod-004', 'Revo Espresso Blend', 'Specially crafted blend for rich, crema-topped espresso shots.', 11.99, 2, 'fine-robusta', 'daklak', '900m', 'Mixed', 'Mixed', 'medium-dark', 'Cocoa, Almond, Brown Sugar', '/images/product-004.png', 200, TRUE),
('prod-005', 'Revo Cold Brew', 'Coarse ground optimized for cold brew extraction. Smooth and low acidity.', 8.49, 2, 'robusta', 'gialai', '750m', 'Natural', 'Natural', 'medium', 'Chocolate, Cherry, Vanilla', '/images/product-005.png', 90, TRUE),
('prod-006', 'Single Origin Buon Ma Thuot', 'Premium single origin from the coffee capital of Vietnam.', 14.99, 3, 'fine-robusta', 'daklak', '850m', 'Honey Process', 'Honey Process', 'medium', 'Tropical Fruit, Honey, Spice', '/images/product-006.png', 50, TRUE),
('prod-007', 'Monthly Discovery Box', '3 bags of rotating single origins delivered monthly.', 29.99, 4, 'subscription', 'various', NULL, 'Various', 'Various', 'various', 'Surprise flavors every month', '/images/product-007.png', 1000, TRUE),
('prod-008', 'Barista Starter Kit', 'Perfect gift for coffee beginners: 2 bags + brewing guide.', 24.99, 5, 'gift-set', 'vietnam', NULL, 'Mixed', 'Mixed', 'mixed', 'Chocolate, Nut, Fruit', '/images/product-008.png', 75, TRUE);

INSERT INTO grind_sizes (name) VALUES
('Whole Bean'), ('Pha phin'), ('Espresso'), ('Cold Brew'), ('French Press');

INSERT INTO flavor_notes (name) VALUES
('Chocolate'), ('Caramel'), ('Hazelnut'), ('Red Apple'), ('Honey'), ('Jasmine'), ('Lemon'), ('Cocoa'), ('Almond'), ('Tropical Fruit');

INSERT INTO product_grind_sizes (product_id, grind_size_id)
SELECT p.id, g.id FROM products p CROSS JOIN grind_sizes g;
