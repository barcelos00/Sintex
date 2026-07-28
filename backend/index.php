<?php

/**
 * ARQUIVO: index.php
 * PROPÓSITO: Ponto de entrada principal — roteador de requisições
 *
 * EXPLICAÇÃO:
 * Este arquivo serve como entry point para o servidor PHP embutido
 * (php -S 0.0.0.0:8000). Ele inspeciona o caminho da requisição e
 * encaminha para o endpoint correto dentro de /api.
 *
 * Rotas suportadas:
 *   /api/auth        → api/auth.php
 *   /api/restaurants → api/restaurants.php
 *   /api/menu        → api/menu.php
 *   /api/ratings     → api/ratings.php
 *   /api/feedbacks   → api/feedbacks.php
 */

// ---------------------------------------------------------------------------
// CORS — necessário para que o frontend React/Vite consiga se comunicar
// ---------------------------------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Responde imediatamente às requisições pre-flight do navegador
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---------------------------------------------------------------------------
// Roteamento
// ---------------------------------------------------------------------------
$requestUri  = $_SERVER['REQUEST_URI'] ?? '/';
$path        = parse_url($requestUri, PHP_URL_PATH);
$path        = rtrim($path, '/');

// Mapa de prefixos de rota → arquivo de endpoint
$routes = [
    '/api/auth'        => __DIR__ . '/api/auth.php',
    '/api/restaurants' => __DIR__ . '/api/restaurants.php',
    '/api/menu'        => __DIR__ . '/api/menu.php',
    '/api/ratings'     => __DIR__ . '/api/ratings.php',
    '/api/feedbacks'   => __DIR__ . '/api/feedbacks.php',
];

foreach ($routes as $prefix => $file) {
    // Corresponde ao prefixo exato ou a sub-caminhos (ex.: /api/auth?action=login)
    if ($path === $prefix || strpos($path, $prefix . '/') === 0) {
        if (file_exists($file)) {
            require $file;
            exit();
        }
    }
}

// ---------------------------------------------------------------------------
// Rota raiz — health check simples
// ---------------------------------------------------------------------------
if ($path === '' || $path === '/') {
    http_response_code(200);
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Sintex Backend API está no ar',
        'versao'   => '1.0.0',
        'rotas'    => array_keys($routes),
    ]);
    exit();
}

// ---------------------------------------------------------------------------
// Rota não encontrada
// ---------------------------------------------------------------------------
http_response_code(404);
echo json_encode([
    'sucesso'  => false,
    'mensagem' => 'Rota não encontrada: ' . $path,
]);
exit();
