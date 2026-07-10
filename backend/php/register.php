<?php
// ==========================================
// 1. CABEÇALHOS CORS E JSON
// ==========================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["password"]) || !isset($data["restaurant"])) {
    echo json_encode(["success" => false, "message" => "Dados incompletos. Preencha todos os campos."]);
    exit;
}

$email = trim($data["email"]);
$senhaCriptografada = password_hash($data["password"], PASSWORD_DEFAULT);
$restaurante = trim($data["restaurant"]); // Nome do administrador/restaurante

if ($email === "" || $restaurante === "") {
    echo json_encode(["success" => false, "message" => "E-mail e restaurante são obrigatórios."]);
    exit;
}

// Verifica se o e-mail já existe
$sql = "SELECT id FROM administradores WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Este e-mail já está cadastrado."]);
    exit;
}

// Verifica se o restaurante já existe
$sqlRest = "SELECT id FROM restaurantes WHERE nome = ?";
$stmtRest = $conn->prepare($sqlRest);
$stmtRest->bind_param("s", $restaurante);
$stmtRest->execute();
if ($stmtRest->get_result()->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Este restaurante já está cadastrado."]);
    exit;
}

// ==========================================
// 2. INSERÇÃO TRIPLA (ADMIN -> RESTAURANTE -> VÍNCULO)
// ==========================================

// Inicia uma transação (Se der erro no meio, ele desfaz tudo para não deixar dados "órfãos")
$conn->begin_transaction();

try {
    // PASSO 1: Insere o administrador
    $sqlAdmin = "INSERT INTO administradores (nome, email, senha) VALUES (?, ?, ?)";
    $stmtAdmin = $conn->prepare($sqlAdmin);
    $stmtAdmin->bind_param("sss", $restaurante, $email, $senhaCriptografada);
    $stmtAdmin->execute();
    $admin_id = $stmtAdmin->insert_id; // Pega o ID gerado

    // PASSO 2: Insere o restaurante apenas com o nome
    $sqlNewRest = "INSERT INTO restaurantes (nome) VALUES (?)";
    $stmtNewRest = $conn->prepare($sqlNewRest);
    $stmtNewRest->bind_param("s", $restaurante);
    $stmtNewRest->execute();
    $restaurante_id = $stmtNewRest->insert_id; // Pega o ID gerado

    // PASSO 3: Faz o vínculo na tabela intermediária
    $permissao = "dono"; // Você pode definir como 'dono', 'editor', etc.
    $sqlVinculo = "INSERT INTO administrador_restaurante (administrador_id, restaurante_id, permissao) VALUES (?, ?, ?)";
    $stmtVinculo = $conn->prepare($sqlVinculo);
    $stmtVinculo->bind_param("iis", $admin_id, $restaurante_id, $permissao);
    $stmtVinculo->execute();

    // Confirma a transação
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Cadastro realizado e restaurante inicializado com sucesso!",
        "admin_id" => $admin_id  // <--- ESSA É A LINHA MÁGICA QUE FALTAVA!
    ]);;

} catch (Exception $e) {
    // Se der erro em qualquer um dos 3 passos, desfaz tudo
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "message" => "Erro ao processar o cadastro: " . $e->getMessage()
    ]);
}
?>