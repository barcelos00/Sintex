<?php
$DB_HOST = 'sql309.infinityfree.com';
$DB_PORT = '3306';
$DB_USER = 'if0_42388559';
$DB_PASS = 'layanne2026';
$DB_NAME = 'if0_42388559_sintex_db';

try {
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