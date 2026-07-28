<?php
$DB_HOST = 'sql309.infinityfree.com';
$DB_PORT = '3306';
$DB_USER = 'if0_42388559';
$DB_PASS = 'layanne2026';
$DB_NAME = 'if0_42388559_sintex_db';

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(["sucesso" => false, "mensagem" => "Erro na conexão: " . $conn->connect_error]));
}
?>