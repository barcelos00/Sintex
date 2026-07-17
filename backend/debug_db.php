<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDB();
    
    // Listar todas as tabelas do banco
    $stmt = $pdo->prepare("SHOW TABLES");
    $stmt->execute();
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo json_encode(['tables' => $tables], JSON_PRETTY_PRINT);
    
    // Se houver uma tabela restaurante, mostrar a estrutura
    if (in_array('restaurantes', $tables)) {
        echo "\n\nEstrutura de 'restaurantes':\n";
        $stmt2 = $pdo->prepare("DESCRIBE restaurantes");
        $stmt2->execute();
        $cols = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($cols, JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
