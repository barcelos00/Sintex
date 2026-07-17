<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDB();
    
    // Adicionar as colunas ausentes
    $queries = [
        "ALTER TABLE restaurantes ADD COLUMN cidade VARCHAR(100) NULL AFTER endereco",
        "ALTER TABLE restaurantes ADD COLUMN estado VARCHAR(2) NULL AFTER cidade"
    ];
    
    foreach ($queries as $query) {
        try {
            $pdo->exec($query);
            echo "✓ Executado: $query\n";
        } catch (PDOException $e) {
            // Ignorar se a coluna já existe
            echo "ℹ Coluna já existe ou erro: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\nTabelas atualizadas com sucesso!";
    
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
