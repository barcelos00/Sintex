<?php
$DB_HOST = '127.0.0.1';
$DB_PORT = '3306';      // A PORTA SECRETA DO SENAC AQUI!
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'sintex_db';

try {
    // Repare que adicionei ;port=$DB_PORT aqui na linha abaixo
    $pdo = new PDO(
        "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        "sucesso" => false, 
        "mensagem" => "Erro DB: " . $e->getMessage()
    ]);
    die();
}

function getDB() {
    global $pdo;
    return $pdo;
}
?>