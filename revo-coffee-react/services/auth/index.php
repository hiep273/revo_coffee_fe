<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');

// Request body parsing
$input = json_decode(file_get_contents('php://input'), true) ?: [];

switch ($path) {
    case 'register':
        handleRegister($pdo, $input);
        break;
    case 'login':
        handleLogin($pdo, $input);
        break;
    case 'profile':
        handleProfile($pdo, $method);
        break;
    case 'users':
        handleUsers($pdo, $method);
        break;
    case 'health':
        jsonResponse(['status' => 'ok', 'service' => 'identity-service']);
        break;
    default:
        jsonResponse(['error' => 'Not Found', 'path' => $path], 404);
}

function handleRegister($pdo, $input) {
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $phone = $input['phone'] ?? null;
    $address = $input['address'] ?? null;

    if (empty($name) || empty($email) || empty($password)) {
        jsonResponse(['error' => 'Name, email and password are required'], 400);
    }

    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hash, $phone, $address]);
    $userId = $pdo->lastInsertId();

    jsonResponse([
        'message' => 'Registration successful',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'customer'
        ]
    ], 201);
}

function handleLogin($pdo, $input) {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }

    $stmt = $pdo->prepare("SELECT id, name, email, password, role, phone, address FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }

    $token = generateJwt([
        'sub' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);

    jsonResponse([
        'message' => 'Login successful',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'phone' => $user['phone'],
            'address' => $user['address']
        ]
    ]);
}

function handleProfile($pdo, $method) {
    $token = getAuthToken();
    if (!$token) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    $payload = validateJwt($token);
    if (!$payload) {
        jsonResponse(['error' => 'Invalid or expired token'], 401);
    }

    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?");
        $stmt->execute([$payload['sub']]);
        $user = $stmt->fetch();

        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }

        jsonResponse(['user' => $user]);
    }

    if ($method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $name = $input['name'] ?? null;
        $phone = $input['phone'] ?? null;
        $address = $input['address'] ?? null;

        $stmt = $pdo->prepare("UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?");
        $stmt->execute([$name, $phone, $address, $payload['sub']]);

        jsonResponse(['message' => 'Profile updated successfully']);
    }

    jsonResponse(['error' => 'Method not allowed'], 405);
}

function handleUsers($pdo, $method) {
    if ($method !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $token = getAuthToken();
    if (!$token) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    $payload = validateJwt($token);
    if (!$payload || $payload['role'] !== 'admin') {
        jsonResponse(['error' => 'Forbidden - Admin access required'], 403);
    }

    $stmt = $pdo->query("SELECT id, name, email, role, phone, address, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();

    jsonResponse(['users' => $users, 'total' => count($users)]);
}

