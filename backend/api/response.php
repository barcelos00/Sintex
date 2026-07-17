<?php
/**
 * ARQUIVO: api/response.php
 * PROPÓSITO: Funções auxiliares para padronizar respostas JSON
 * 
 * EXPLICAÇÃO:
 * Todas as APIs retornam JSON com um formato padrão
 * Isso facilita o trabalho no React
 */

// Configurar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Se for uma requisição OPTIONS, responder e sair
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurar header para JSON
header('Content-Type: application/json; charset=utf-8');

/**
 * FUNÇÃO: responderJson()
 * Retorna resposta padronizada em JSON
 * 
 * @param bool $sucesso - Indicador de sucesso
 * @param string $mensagem - Mensagem para o usuário
 * @param array $dados - Dados adicionais
 * @param int $status_code - Status HTTP
 */
function responderJson($sucesso, $mensagem, $dados = [], $status_code = 200) {
    http_response_code($status_code);
    
    echo json_encode([
        'sucesso' => $sucesso,
        'mensagem' => $mensagem,
        'dados' => $dados
    ]);
    
    exit;
}

/**
 * FUNÇÃO: responderErro()
 * Atalho para responder com erro
 */
function responderErro($mensagem, $dados = [], $status_code = 400) {
    responderJson(false, $mensagem, $dados, $status_code);
}

/**
 * FUNÇÃO: responderSucesso()
 * Atalho para responder com sucesso
 */
function responderSucesso($mensagem, $dados = [], $status_code = 200) {
    responderJson(true, $mensagem, $dados, $status_code);
}

/**
 * FUNÇÃO: obterDadosJSON()
 * Obtém dados do POST em formato JSON
 */
function obterDadosJSON() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?? [];
}

?>
