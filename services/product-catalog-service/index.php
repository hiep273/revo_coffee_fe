<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = array_values(array_filter(explode('/', $path)));

if (($segments[0] ?? '') === 'api') {
    array_shift($segments);
}

try {
    if (($segments[0] ?? '') === 'health') {
        json_response(['status' => 'ok', 'service' => 'product-catalog-service']);
    }

    if (($segments[0] ?? '') === 'categories') {
        handle_categories($pdo, $method);
    }

    if (($segments[0] ?? '') === 'products') {
        handle_products($pdo, $method, $segments[1] ?? null);
    }

    json_response(['error' => 'Not Found', 'path' => $path], 404);
} catch (PDOException $ex) {
    json_response(['error' => 'Database error', 'detail' => $ex->getMessage()], 500);
}

function handle_categories(PDO $pdo, string $method): void
{
    if ($method !== 'GET') {
        json_response(['error' => 'Method not allowed'], 405);
    }

    $items = $pdo->query('SELECT id, name, description, created_at FROM categories ORDER BY name')->fetchAll();
    json_response(['items' => $items, 'total' => count($items)]);
}

function handle_products(PDO $pdo, string $method, ?string $id): void
{
    if ($method === 'GET' && $id === null) {
        json_response(list_products($pdo));
    }

    if ($method === 'GET' && $id !== null) {
        $stmt = $pdo->prepare(product_select_sql() . ' WHERE p.id = ? LIMIT 1');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) {
            json_response(['error' => 'Product not found'], 404);
        }
        json_response(shape_product($product));
    }

    if ($method === 'POST') {
        $data = body();
        validate_product($data);
        $id = $data['id'] ?? uuid();

        $stmt = $pdo->prepare(
            'INSERT INTO products (id, name, description, price, category_id, type, region, altitude, process_method, processing_method, roast_level, flavor_notes, image_url, stock, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $id,
            $data['name'],
            $data['description'] ?? null,
            $data['price'],
            $data['category_id'] ?? null,
            $data['type'] ?? null,
            $data['region'] ?? null,
            $data['altitude'] ?? null,
            $data['process_method'] ?? ($data['processing_method'] ?? null),
            $data['processing_method'] ?? ($data['process_method'] ?? null),
            $data['roast_level'],
            is_array($data['flavor_notes'] ?? null) ? implode(', ', $data['flavor_notes']) : ($data['flavor_notes'] ?? null),
            $data['image_url'] ?? null,
            $data['stock'] ?? 0,
            $data['is_active'] ?? true,
        ]);

        json_response(['message' => 'Product created', 'id' => $id], 201);
    }

    if ($method === 'PUT' && $id !== null) {
        $data = body();
        validate_product($data);

        $stmt = $pdo->prepare(
            'UPDATE products
             SET name = ?, description = ?, price = ?, category_id = ?, type = ?, region = ?, altitude = ?,
                 process_method = ?, processing_method = ?, roast_level = ?, flavor_notes = ?, image_url = ?,
                 stock = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?'
        );
        $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['price'],
            $data['category_id'] ?? null,
            $data['type'] ?? null,
            $data['region'] ?? null,
            $data['altitude'] ?? null,
            $data['process_method'] ?? ($data['processing_method'] ?? null),
            $data['processing_method'] ?? ($data['process_method'] ?? null),
            $data['roast_level'],
            is_array($data['flavor_notes'] ?? null) ? implode(', ', $data['flavor_notes']) : ($data['flavor_notes'] ?? null),
            $data['image_url'] ?? null,
            $data['stock'] ?? 0,
            $data['is_active'] ?? true,
            $id,
        ]);

        json_response(['message' => 'Product updated', 'id' => $id]);
    }

    if ($method === 'DELETE' && $id !== null) {
        $stmt = $pdo->prepare('UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['message' => 'Product deactivated', 'id' => $id]);
    }

    json_response(['error' => 'Method not allowed'], 405);
}

function list_products(PDO $pdo): array
{
    $where = ['p.is_active = TRUE'];
    $params = [];

    $search = trim((string)($_GET['search'] ?? ''));
    if ($search !== '') {
        $where[] = '(p.name LIKE ?
            OR p.description LIKE ?
            OR p.type LIKE ?
            OR p.region LIKE ?
            OR p.roast_level LIKE ?
            OR p.flavor_notes LIKE ?
            OR COALESCE(p.processing_method, p.process_method) LIKE ?
            OR c.name LIKE ?)';
        $searchPattern = '%' . $search . '%';
        array_push(
            $params,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern,
            $searchPattern
        );
    }

    $searchMinPrice = trim((string)($_GET['searchMinPrice'] ?? ''));
    $searchMaxPrice = trim((string)($_GET['searchMaxPrice'] ?? ''));
    if ($searchMinPrice !== '' && !is_numeric($searchMinPrice)) {
        json_response(['error' => 'Search minimum price must be numeric'], 400);
    }
    if ($searchMaxPrice !== '' && !is_numeric($searchMaxPrice)) {
        json_response(['error' => 'Search maximum price must be numeric'], 400);
    }
    if ($searchMinPrice !== '' && $searchMaxPrice !== '' && (float)$searchMinPrice > (float)$searchMaxPrice) {
        json_response(['error' => 'Search minimum price cannot be greater than search maximum price'], 400);
    }
    if ($searchMinPrice !== '') {
        $where[] = 'p.price >= ?';
        $params[] = $searchMinPrice;
    }
    if ($searchMaxPrice !== '') {
        $where[] = 'p.price <= ?';
        $params[] = $searchMaxPrice;
    }

    $filterGroup = strtolower(trim((string)($_GET['filterGroup'] ?? 'none')));
    if (!in_array($filterGroup, ['none', 'price', 'type', 'region'], true)) {
        json_response(['error' => 'Filter group is not supported'], 400);
    }

    if ($filterGroup === 'price') {
        $minPrice = trim((string)($_GET['minPrice'] ?? ''));
        $maxPrice = trim((string)($_GET['maxPrice'] ?? ''));

        if ($minPrice !== '' && !is_numeric($minPrice)) {
            json_response(['error' => 'Minimum price must be numeric'], 400);
        }
        if ($maxPrice !== '' && !is_numeric($maxPrice)) {
            json_response(['error' => 'Maximum price must be numeric'], 400);
        }
        if ($minPrice !== '' && $maxPrice !== '' && (float)$minPrice > (float)$maxPrice) {
            json_response(['error' => 'Minimum price cannot be greater than maximum price'], 400);
        }

        if ($minPrice !== '') {
            $where[] = 'p.price >= ?';
            $params[] = $minPrice;
        }
        if ($maxPrice !== '') {
            $where[] = 'p.price <= ?';
            $params[] = $maxPrice;
        }
    }

    if ($filterGroup === 'type') {
        $type = trim((string)($_GET['type'] ?? ''));
        if ($type !== '' && $type !== 'all') {
            $where[] = 'p.type = ?';
            $params[] = $type;
        }
    }

    if ($filterGroup === 'region') {
        $regions = array_values(array_filter(array_map(
            'trim',
            explode(',', (string)($_GET['regions'] ?? ''))
        )));

        if (count($regions) > 0) {
            $placeholders = implode(', ', array_fill(0, count($regions), '?'));
            $where[] = "p.region IN ({$placeholders})";
            array_push($params, ...$regions);
        }
    }

    $paginationRequested = isset($_GET['page']) || isset($_GET['limit']);
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 9);
    if ($page < 1) {
        $page = 1;
    }
    if ($limit < 1) {
        $limit = 9;
    }
    if ($limit > 100) {
        $limit = 100;
    }

    $whereSql = implode(' AND ', $where);
    $countStmt = $pdo->prepare("SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE {$whereSql}");
    $countStmt->execute($params);
    $total = (int)($countStmt->fetch()['total'] ?? 0);

    if (!$paginationRequested) {
        $sql = product_select_sql() . " WHERE {$whereSql} ORDER BY p.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return [
            'items' => array_map('shape_product', $stmt->fetchAll()),
            'page' => 1,
            'limit' => $total,
            'total' => $total,
            'totalPages' => 1,
        ];
    }

    $totalPages = max(1, (int)ceil($total / $limit));
    if ($page > $totalPages) {
        $page = $totalPages;
    }

    $offset = ($page - 1) * $limit;
    $sql = product_select_sql() . " WHERE {$whereSql} ORDER BY p.created_at DESC LIMIT {$limit} OFFSET {$offset}";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return [
        'items' => array_map('shape_product', $stmt->fetchAll()),
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'totalPages' => $totalPages,
    ];
}

function validate_product(array $data): void
{
    if (empty($data['name'])) {
        json_response(['error' => 'Product name is required'], 400);
    }
    if (!isset($data['price']) || !is_numeric($data['price'])) {
        json_response(['error' => 'Valid product price is required'], 400);
    }
    $roast = strtolower((string)($data['roast_level'] ?? ''));
    if (!in_array($roast, ['light', 'medium', 'dark', 'medium-dark', 'various', 'mixed'], true)) {
        json_response(['error' => 'Roast level is not supported'], 400);
    }
}

function product_select_sql(): string
{
    return 'SELECT p.id, p.name, p.description, p.price, p.category_id, c.name AS category_name,
                   p.type, p.region, p.altitude, COALESCE(p.processing_method, p.process_method) AS processing_method,
                   p.roast_level, p.flavor_notes, p.image_url, p.stock, p.is_active, p.created_at, p.updated_at
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id';
}

function shape_product(array $row): array
{
    $row['desc'] = $row['description'];
    $row['process'] = $row['processing_method'];
    $row['roast'] = $row['roast_level'];
    $row['flavorNotes'] = $row['flavor_notes'];
    $row['image'] = $row['image_url'];
    return $row;
}

function uuid(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
