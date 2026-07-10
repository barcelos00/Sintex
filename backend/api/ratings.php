<?php
/**
 * ARQUIVO: api/ratings.php
 * PROPÓSITO: Endpoints para gerenciar avaliações
 * 
 * EXPLICAÇÃO:
 * Rotas:
 * POST /api/ratings.php - Criar avaliação
 * GET /api/ratings.php?restaurant_id=1 - Listar avaliações
 * GET /api/ratings.php?restaurant_id=1&tipo=positivas - Apenas positivas
 * GET /api/ratings.php?action=stats&restaurant_id=1 - Estatísticas
 */

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../models/Rating.php';
require_once __DIR__ . '/../models/Restaurant.php';

session_start();

$rating = new Rating();

// ============================================================================
// POST /api/ratings.php
// Criar nova avaliação
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $dados = obterDadosJSON();
    
    // Validar campos obrigatórios
    if (empty($dados['restaurant_id'])) {
        responderErro('ID do restaurante é obrigatório', [], 400);
    }
    
    if (empty($dados['customer_name'])) {
        responderErro('Nome é obrigatório', [], 400);
    }
    
    if (!isset($dados['rating']) || $dados['rating'] < 1 || $dados['rating'] > 5) {
        responderErro('Avaliação deve ser entre 1 e 5 estrelas', [], 400);
    }
    
    $restaurant_id = intval($dados['restaurant_id']);
    $browser_fingerprint = $dados['browser_fingerprint'] ?? null;
    
    // Verificar se já avaliou
    if ($browser_fingerprint && $rating->verificarJaAvaliou($restaurant_id, $browser_fingerprint)) {
        responderErro('Você já avaliou este restaurante', [], 409);
    }
    
    // Criar avaliação
    $resultado = $rating->criar($restaurant_id, $dados);
    
    if ($resultado['sucesso']) {
        responderSucesso($resultado['mensagem'], ['id' => $resultado['id']], 201);
    } else {
        responderErro($resultado['mensagem'], [], 400);
    }
}

// ============================================================================
// GET /api/ratings.php
// Listar avaliações de um restaurante
// ============================================================================
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // Ação especial: Estatísticas gerais (painel admin)
    if ($_GET['action'] === 'stats_gerais' && isset($_SESSION['user_id'])) {
        $stats = $rating->obterEstatisticasGerais($_SESSION['user_id']);
        
        if ($stats) {
            responderSucesso('Estatísticas obtidas', ['stats' => $stats]);
        } else {
            responderErro('Erro ao obter estatísticas', []);
        }
    }
    
    // Listar avaliações de um restaurante
    elseif (isset($_GET['restaurant_id'])) {
        
        $restaurant_id = intval($_GET['restaurant_id']);
        $tipo = $_GET['tipo'] ?? 'todas'; // 'todas', 'positivas', 'negativas'
        $limite = intval($_GET['limite'] ?? 10);
        
        // Validar tipo
        if (!in_array($tipo, ['todas', 'positivas', 'negativas'])) {
            responderErro('Tipo de avaliação inválido', [], 400);
        }
        
        // Listar
        $avaliacoes = $rating->listarPorRestaurante($restaurant_id, $tipo, $limite);
        
        responderSucesso('Avaliações listadas', ['avaliacoes' => $avaliacoes]);
    }
    
    // Estatísticas de um restaurante
    elseif ($_GET['action'] === 'stats' && isset($_GET['restaurant_id'])) {
        
        $restaurant_id = intval($_GET['restaurant_id']);
        $stats = $rating->obterEstatisticas($restaurant_id);
        
        if ($stats) {
            responderSucesso('Estatísticas obtidas', ['stats' => $stats]);
        } else {
            responderErro('Restaurante não encontrado', [], 404);
        }
    }
    
    else {
        responderErro('Parâmetros inválidos', [], 400);
    }
}

// ============================================================================
// Método HTTP inválido
// ============================================================================
else {
    responderErro('Método HTTP não permitido', [], 405);
}

?>
