<?php
/**
 * ARQUIVO: api/feedbacks.php
 * PROPÓSITO: Endpoint para os clientes enviarem feedbacks aos restaurantes
 */

// ============================================================================
// 1. CABEÇALHOS CORS (Permite que o React converse com este arquivo)
// ============================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Interceptador Pre-flight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/../config/db.php';

// ============================================================================
// POST: Receber e salvar o novo feedback
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Lê o JSON enviado pelo React
    $dados = json_decode(file_get_contents("php://input"), true);

    // Validação de segurança: Não deixa salvar se faltar ID do restaurante ou o texto
    if (empty($dados['restaurante_id']) || empty($dados['comentario'])) {
        responderErro('O ID do restaurante e o comentário são obrigatórios.', [], 400);
        exit;
    }

    // Limpa os dados para evitar injeção de código
    $restaurante_id = intval($dados['restaurante_id']);
    $nome_cliente = !empty($dados['nome_cliente']) ? trim($dados['nome_cliente']) : 'Cliente Anônimo';
    $comentario = trim($dados['comentario']);

    try {
        $pdo = getDB(); // Puxa a conexão do seu db.php
        
        // Insere o comentário na tabela que criamos
        $sql = "INSERT INTO feedbacks (restaurante_id, nome_cliente, comentario) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$restaurante_id, $nome_cliente, $comentario]);

        responderSucesso('Feedback enviado com sucesso!', ['id' => $pdo->lastInsertId()]);

    } catch (PDOException $e) {
        responderErro('Erro ao salvar o feedback no banco de dados.', [], 500);
    }
    
} else {
    responderErro('Método HTTP não permitido. Use POST.', [], 405);
}
?>