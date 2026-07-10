<?php
// ==========================================
// 1. CABEÇALHOS CORS E JSON
// ==========================================
// Permite que o React (Vite) converse com o PHP
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// ==========================================
// 2. INTERCEPTADOR PRE-FLIGHT
// ==========================================
// O navegador faz uma requisição OPTIONS antes de enviar o POST com JSON.
// Precisamos retornar sucesso (200) imediatamente para ele liberar o POST real.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==========================================
// 3. CONEXÃO COM O BANCO DE DADOS
// ==========================================
include "db.php"; 

// ==========================================
// 4. PROCESSAMENTO DOS DADOS (PAYLOAD)
// ==========================================
// Pega o texto puro enviado pelo React e transforma em um array associativo do PHP
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Valida se as variáveis realmente existem no array (evita erro "Undefined array key" no PHP, que quebra o JSON)
if (!isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Dados de acesso inválidos ou incompletos."]);
    exit();
}

// Remove espaços em branco acidentais do início/fim do email
$email = trim($data["email"]);
$senhaDigitada = $data["password"];

// ==========================================
// 5. LÓGICA DE AUTENTICAÇÃO E BANCO DE DADOS
// ==========================================
// Busca o usuário no banco de dados de forma segura
$stmt = $conn->prepare("SELECT * FROM administradores WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

// Se não achar o e-mail, avisa o React
if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email não encontrado!"]);
    $stmt->close();
    $conn->close();
    exit();
}

$admin = $resultado->fetch_assoc();

// Compara a senha digitada com a criptografada (hash) que está no banco
if (password_verify($senhaDigitada, $admin["senha"])) {
    // Retornamos também os dados básicos (exceto a senha!) para o React salvar no Context/LocalStorage se precisar
    echo json_encode([
        "success" => true, 
        "message" => "Login bem-sucedido!",
        "user" => [
            "id" => $admin["id"],
            "email" => $admin["email"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Senha incorreta!"]);
}

// Limpa memória e fecha a conexão
$stmt->close();
$conn->close();
?>