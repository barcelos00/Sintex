<?php
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "sintex_db";
$port = 3306; // A PORTA SECRETA DO SENAC AQUI!

// Adicionamos a variável $port no final
$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode(["sucesso" => false, "mensagem" => "Erro na conexão: " . $conn->connect_error]));
}
