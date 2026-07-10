<?php

/**
 * ARQUIVO: api/auth.php
 * PROPÓSITO: Endpoints de autenticação (login, registro, logout)
 * 
 * EXPLICAÇÃO:
 * Este arquivo define as rotas:
 * POST /api/auth.php?action=register - Registrar novo admin
 * POST /api/auth.php?action=login - Fazer login
 * POST /api/auth.php?action=logout - Fazer logout
 */

// CORS e JSON necessários para requisições do React/Vite
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/User.php';

// Iniciar sessão para manter usuário logado
session_start();

// Obter ação do URL
$action = $_GET['action'] ?? 'login';

// Obter dados do POST
$dados = obterDadosJSON();

// Instanciar modelo de usuário
$user = new User();

// ============================================================================
// ENDPOINT: POST /api/auth.php?action=register
// PROPÓSITO: Criar novo administrador
// ============================================================================
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validar campos obrigatórios
    if (empty($dados['name'])) {
        responderErro('Nome é obrigatório', [], 400);
    }

    if (empty($dados['email'])) {
        responderErro('Email é obrigatório', [], 400);
    }

    if (empty($dados['password'])) {
        responderErro('Senha é obrigatória', [], 400);
    }

    if (strlen($dados['password']) < 6) {
        responderErro('Senha deve ter no mínimo 6 caracteres', [], 400);
    }

    // Validar formato de email
    if (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        responderErro('Email inválido', [], 400);
    }

    // Tentar criar usuário
    $resultado = $user->criar(
        $dados['name'],
        $dados['email'],
        $dados['password'],
        $dados['phone'] ?? null
    );

    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 409);
    }
}

// ============================================================================
// ENDPOINT: POST /api/auth.php?action=login
// PROPÓSITO: Fazer login do administrador
// ============================================================================
elseif ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validar campos
    if (empty($dados['email'])) {
        responderErro('Email é obrigatório', [], 400);
    }

    if (empty($dados['password'])) {
        responderErro('Senha é obrigatória', [], 400);
    }

    // Tentar fazer login
    $resultado = $user->login($dados['email'], $dados['password']);

    if ($resultado['sucesso']) {
        // Armazenar usuário na sessão
        $_SESSION['user_id'] = $resultado['usuario']['id'];
        $_SESSION['user_name'] = $resultado['usuario']['name'];
        $_SESSION['user_email'] = $resultado['usuario']['email'];

        responderSucesso(
            $resultado['mensagem'],
            ['usuario' => $resultado['usuario']],
            200
        );
    } else {
        responderErro($resultado['mensagem'], [], 401);
    }
}

// ============================================================================
// ENDPOINT: POST /api/auth.php?action=logout
// PROPÓSITO: Fazer logout
// ============================================================================
elseif ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {

    session_destroy();
    responderSucesso('Logout realizado com sucesso');
}

// ============================================================================
// ENDPOINT: GET /api/auth.php?action=verificar
// PROPÓSITO: Verificar se está logado
// ============================================================================
elseif ($action === 'verificar' && $_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_SESSION['user_id'])) {
        responderSucesso('Usuário logado', [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ]);
    } else {
        responderErro('Não está logado', [], 401);
    }
}

// ============================================================================
// ENDPOINT INVÁLIDO
// ============================================================================
else {
    responderErro('Ação inválida', [], 404);
}
