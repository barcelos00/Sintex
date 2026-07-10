<?php
/**
 * ARQUIVO: api/menu.php
 * PROPÓSITO: Endpoints para gerenciar cardápio
 */

// ============================================================================
// 1. CABEÇALHOS CORS
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/Menu.php';
require_once __DIR__ . '/../models/Restaurant.php';

$menu = new Menu();
$restaurant = new Restaurant();

// Obter action
$action = $_GET['action'] ?? 'listar';

// ============================================================================
// POST: Criar categoria
// ============================================================================
if ($action === 'criar_categoria' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = obterDadosJSON();
    
    if (empty($dados['restaurant_id']) || empty($dados['name'])) {
        responderErro('Restaurant ID e Name são obrigatórios', [], 400);
    }
    
    $resultado = $menu->criarCategoria(
        $dados['restaurant_id'],
        $dados['name'],
        $dados['description'] ?? null,
        $dados['order'] ?? 0
    );
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// POST: Criar produto
// ============================================================================
elseif ($action === 'criar_produto' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = obterDadosJSON();
    
    if (empty($dados['menu_category_id']) || empty($dados['restaurant_id'])) {
        responderErro('Category ID e Restaurant ID são obrigatórios', [], 400);
    }
    
    $resultado = $menu->criarProduto(
        $dados['menu_category_id'],
        $dados['restaurant_id'],
        $dados
    );
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ... Restante do código (PUT, DELETE, etc.) seguiria a mesma lógica sem usar $_SESSION
else {
    responderErro('Ação inválida ou método HTTP não permitido', [], 405);
}
?>