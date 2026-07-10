<?php
/**
 * ARQUIVO: models/Rating.php
 * PROPÓSITO: Gerenciar avaliações e comentários
 * 
 * EXPLICAÇÃO:
 * Métodos para:
 * - Criar avaliação
 * - Listar avaliações de um restaurante
 * - Separar comentários positivos e negativos
 * - Verificar se já avaliou (por fingerprint do navegador)
 */

require_once __DIR__ . '/../config/db.php';

class Rating {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getDB();
    }
    
    /**
     * MÉTODO: criar()
     * Cria uma nova avaliação
     * 
     * @param int $restaurant_id - ID do restaurante
     * @param array $dados - Dados da avaliação
     * @return array - Resposta de sucesso ou erro
     */
    public function criar($restaurant_id, $dados) {
        try {
            // Calcular se é comentário positivo ou negativo
            $rating = intval($dados['rating']);
            $is_positive = ($rating >= 4); // 4 ou 5 estrelas = positivo
            
            // Inserir avaliação
            $sql = "INSERT INTO ratings (
                        restaurant_id, customer_name, customer_email, rating,
                        positive_point, negative_point, comment, 
                        browser_fingerprint, is_positive
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->pdo->prepare($sql);
            
            $stmt->execute([
                $restaurant_id,
                $dados['customer_name'] ?? 'Anônimo',
                $dados['customer_email'] ?? null,
                $rating,
                $dados['positive_point'] ?? null,
                $dados['negative_point'] ?? null,
                $dados['comment'] ?? null,
                $dados['browser_fingerprint'] ?? null,
                $is_positive
            ]);
            
            // Atualizar média de avaliações do restaurante
            $restaurant = new Restaurant();
            $restaurant->atualizarAvaliacao($restaurant_id);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Avaliação registrada com sucesso',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: listarPorRestaurante()
     * Lista avaliações de um restaurante
     * 
     * @param int $restaurant_id - ID do restaurante
     * @param string $tipo - 'positivas', 'negativas', ou 'todas'
     * @param int $limite - Quantidade de resultados
     * @return array - Lista de avaliações
     */
    public function listarPorRestaurante($restaurant_id, $tipo = 'todas', $limite = 10) {
        try {
            $sql = "SELECT * FROM ratings WHERE restaurant_id = ?";
            $parametros = [$restaurant_id];
            
            // Filtrar por tipo de comentário
            if ($tipo === 'positivas') {
                $sql .= " AND is_positive = TRUE";
            } elseif ($tipo === 'negativas') {
                $sql .= " AND is_positive = FALSE";
            }
            
            // Ordenar por mais recentes
            $sql .= " ORDER BY created_at DESC LIMIT ?";
            $parametros[] = $limite;
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($parametros);
            
            return $stmt->fetchAll();
            
        } catch (PDOException $e) {
            return [];
        }
    }
    
    /**
     * MÉTODO: verificarJaAvaliou()
     * Verifica se o usuário já avaliou este restaurante
     * 
     * @param int $restaurant_id - ID do restaurante
     * @param string $browser_fingerprint - Identificador do navegador
     * @return bool - true se já avaliou, false se não
     */
    public function verificarJaAvaliou($restaurant_id, $browser_fingerprint) {
        try {
            $stmt = $this->pdo->prepare(
                "SELECT id FROM ratings 
                 WHERE restaurant_id = ? AND browser_fingerprint = ?
                 LIMIT 1"
            );
            $stmt->execute([$restaurant_id, $browser_fingerprint]);
            
            return $stmt->rowCount() > 0;
            
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * MÉTODO: obterEstatisticas()
     * Obtém estatísticas de avaliações de um restaurante
     * 
     * @param int $restaurant_id - ID do restaurante
     * @return array - Estatísticas
     */
    public function obterEstatisticas($restaurant_id) {
        try {
            $sql = "SELECT 
                        COUNT(*) as total,
                        AVG(rating) as media,
                        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as estrelas_5,
                        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as estrelas_4,
                        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as estrelas_3,
                        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as estrelas_2,
                        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as estrelas_1,
                        SUM(CASE WHEN is_positive = TRUE THEN 1 ELSE 0 END) as positivas,
                        SUM(CASE WHEN is_positive = FALSE THEN 1 ELSE 0 END) as negativas
                    FROM ratings 
                    WHERE restaurant_id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$restaurant_id]);
            
            return $stmt->fetch();
            
        } catch (PDOException $e) {
            return null;
        }
    }
    
    /**
     * MÉTODO: obterEstatisticasGerais()
     * Obtém estatísticas gerais para o painel do admin
     * 
     * @param int $user_id - ID do administrador
     * @return array - Estatísticas gerais
     */
    public function obterEstatisticasGerais($user_id) {
        try {
            $sql = "SELECT 
                        COUNT(DISTINCT r.id) as total_restaurantes,
                        COUNT(DISTINCT mi.id) as total_produtos,
                        COUNT(rat.id) as total_avaliacoes,
                        AVG(rat.rating) as media_geral
                    FROM restaurants r
                    LEFT JOIN menu_items mi ON mi.restaurant_id = r.id
                    LEFT JOIN ratings rat ON rat.restaurant_id = r.id
                    WHERE r.user_id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$user_id]);
            
            return $stmt->fetch();
            
        } catch (PDOException $e) {
            return null;
        }
    }
}
?>
