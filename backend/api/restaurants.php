<?php

/**
 * ARQUIVO: api/restaurants.php
 * PROPÓSITO: Endpoints para gerenciar restaurantes
 */

// ============================================================================
// 1. CABEÇALHOS CORS E JSON (Essencial para o Vite/React)
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Interceptador Pre-flight (Resolve o erro vermelho no Network)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================================================
// 2. DEPENDÊNCIAS
// ============================================================================
require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/Restaurant.php';

session_start();

$restaurant = new Restaurant();

// ============================================================================
// GET /api/restaurants.php
// Listar restaurantes (Geral ou por Administrador)
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {

    // ======== AQUI ESTÁ A ALTERAÇÃO ========
    // Se o React enviou o ID do administrador logado na URL:
    if (isset($_GET['admin_id'])) {
        $admin_id = intval($_GET['admin_id']);

        // Usa a nova função que busca apenas o restaurante dele (com o cardápio)
        $restaurantes = $restaurant->listarPorAdmin($admin_id);

        responderSucesso('Restaurantes do admin', ['restaurantes' => $restaurantes]);
        exit(); // Encerra o script aqui
    }
    // =======================================

    // Se NÃO tem admin_id, faz a busca geral (comum para a página Home)
    $filtros = [
        'cidade' => $_GET['cidade'] ?? '',
        'categoria' => $_GET['categoria'] ?? '',
        'busca' => $_GET['busca'] ?? ''
    ];

    $limite = intval($_GET['limite'] ?? 10);
    $pagina = intval($_GET['pagina'] ?? 1);

    $restaurantes = $restaurant->listar($filtros, $limite, $pagina);

    responderSucesso('Restaurantes listados', ['restaurantes' => $restaurantes]);
}

// ============================================================================
// GET /api/restaurants.php?id=1
// Obter detalhes de um restaurante específico
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {

    $id = intval($_GET['id']);
    $dados = $restaurant->obter($id);

    if ($dados) {
        responderSucesso('Restaurante encontrado', ['restaurante' => $dados]);
    } else {
        responderErro('Restaurante não encontrado', [], 404);
    }
}

// ============================================================================
// POST /api/restaurants.php
// Criar novo restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!isset($_GET['admin_id'])) {
        responderErro('ID do administrador é obrigatório para cadastrar restaurante', [], 403);
    }

    $admin_id = intval($_GET['admin_id']);

    // Obter dados
    $dados = obterDadosJSON();

    // Validar campos obrigatórios
    if (empty($dados['name'])) {
        responderErro('Nome do restaurante é obrigatório', [], 400);
    }
    if (empty($dados['address'])) {
        responderErro('Endereço é obrigatório', [], 400);
    }

    // Criar restaurante
    $resultado = $restaurant->criar($admin_id, $dados);

    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// PUT /api/restaurants.php?id=1
// Atualizar restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    // Obter ID do Restaurante
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }

    // Obter o ID do Admin que está salvando as alterações (enviado pelo React na URL)
    if (!isset($_GET['admin_id'])) {
        responderErro('ID do administrador é obrigatório para salvar', [], 403);
    }

    $id = intval($_GET['id']);
    $admin_id = intval($_GET['admin_id']);

    $dados = obterDadosJSON();

    // O método atualizar agora recebe o admin_id correto para garantir a segurança
    $resultado = $restaurant->atualizar($id, $admin_id, $dados);

    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 403);
    }
}

// ============================================================================
// DELETE /api/restaurants.php?id=1&admin_id=1
// Deletar restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    // Obter ID do restaurante
    if (!isset($_GET['id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }

    if (!isset($_GET['admin_id'])) {
        responderErro('ID do administrador é obrigatório para excluir restaurante', [], 403);
    }

    $id = intval($_GET['id']);
    $admin_id = intval($_GET['admin_id']);

    // Deletar
    $resultado = $restaurant->deletar($id, $admin_id);

    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem']);
    } else {
        responderErro($resultado['mensagem'], [], 403);
    }
}

// ============================================================================
// Método HTTP inválido
// ============================================================================
else {
    responderErro('Método HTTP não permitido', [], 405);
}
