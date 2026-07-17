<?php
$host = "sql309.infinityfree.com";
$usuario = "if0_42388559";
$senha = "SUA_SENHA_DA_INFINITYFREE"; // coloque a sua senha real aqui
$banco = "if0_42388559_sintex_db";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(["sucesso" => false, "mensagem" => "Erro na conexão: " . $conn->connect_error]));
}
?>