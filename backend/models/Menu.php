<?php
/**
 * ARQUIVO: models/Menu.php
 * PROPÓSITO: Gerenciar cardápio, categorias e produtos
 * 
 * EXPLICAÇÃO:
 * Métodos para:
 * - Criar categorias de cardápio
 * - Criar produtos
 * - Deletar produtos
 * - Upload de cardápio (PDF, JPG, PNG)
 */

require_once __DIR__ . '/../config/db.php';

class Menu {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getDB();
    }
    
    /**
     * MÉTODO: criarCategoria()
     * Cria uma nova categoria no cardápio
     * 
     * @param int $restaurant_id - ID do restaurante
     * @param string $name - Nome da categoria
     * @param string $description - Descrição
     * @param int $order - Ordem de exibição
     * @return array - Resposta com ID da categoria
     */
    public function criarCategoria($restaurant_id, $name, $description = null, $order = 0) {
        try {
            $stmt = $this->pdo->prepare(
                "INSERT INTO menu_categories (restaurant_id, name, description, `order`) 
                 VALUES (?, ?, ?, ?)"
            );
            
            $stmt->execute([$restaurant_id, $name, $description, $order]);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Categoria criada',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: criarProduto()
     * Cria um novo produto no cardápio
     * 
     * @param int $menu_category_id - ID da categoria
     * @param int $restaurant_id - ID do restaurante
     * @param array $dados - Dados do produto
     * @return array - Resposta
     */
    public function criarProduto($menu_category_id, $restaurant_id, $dados) {
        try {
            $stmt = $this->pdo->prepare(
                "INSERT INTO menu_items 
                 (menu_category_id, restaurant_id, name, description, price, image_url, is_available)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            
            $stmt->execute([
                $menu_category_id,
                $restaurant_id,
                $dados['name'] ?? null,
                $dados['description'] ?? null,
                $dados['price'] ?? 0,
                $dados['image_url'] ?? null,
                $dados['is_available'] ?? true
            ]);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Produto criado',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: atualizarProduto()
     * Atualiza dados do produto
     * 
     * @param int $id - ID do produto
     * @param int $restaurant_id - ID do restaurante (verificação)
     * @param array $dados - Dados a atualizar
     * @return array - Resposta
     */
    public function atualizarProduto($id, $restaurant_id, $dados) {
        try {
            // Verificar se pertence ao restaurante
            $stmt = $this->pdo->prepare("SELECT restaurant_id FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);
            $produto = $stmt->fetch();
            
            if (!$produto || $produto['restaurant_id'] != $restaurant_id) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado'];
            }
            
            $permitidos = ['name', 'description', 'price', 'image_url', 'is_available'];
            $atualizacoes = [];
            $valores = [];
            
            foreach ($permitidos as $campo) {
                if (isset($dados[$campo])) {
                    $atualizacoes[] = "$campo = ?";
                    $valores[] = $dados[$campo];
                }
            }
            
            if (empty($atualizacoes)) {
                return ['sucesso' => false, 'mensagem' => 'Nenhum campo para atualizar'];
            }
            
            $valores[] = $id;
            $sql = "UPDATE menu_items SET " . implode(', ', $atualizacoes) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($valores);
            
            return ['sucesso' => true, 'mensagem' => 'Produto atualizado'];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: deletarProduto()
     * Deleta um produto
     * 
     * @param int $id - ID do produto
     * @param int $restaurant_id - ID do restaurante (verificação)
     * @return array - Resposta
     */
    public function deletarProduto($id, $restaurant_id) {
        try {
            $stmt = $this->pdo->prepare("SELECT restaurant_id FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);
            $produto = $stmt->fetch();
            
            if (!$produto || $produto['restaurant_id'] != $restaurant_id) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado'];
            }
            
            $stmt = $this->pdo->prepare("DELETE FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);
            
            return ['sucesso' => true, 'mensagem' => 'Produto deletado'];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: uploadCardapio()
     * Registra upload de cardápio (PDF, JPG, PNG)
     * 
     * @param int $restaurant_id - ID do restaurante
     * @param string $file_type - Tipo de arquivo (PDF, JPG, PNG)
     * @param string $file_url - Caminho do arquivo
     * @param string $file_name - Nome original do arquivo
     * @return array - Resposta
     */
    public function uploadCardapio($restaurant_id, $file_type, $file_url, $file_name) {
        try {
            $stmt = $this->pdo->prepare(
                "INSERT INTO menu_uploads 
                 (restaurant_id, file_type, file_url, file_name)
                 VALUES (?, ?, ?, ?)"
            );
            
            $stmt->execute([$restaurant_id, $file_type, $file_url, $file_name]);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Cardápio enviado',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: obterUploads()
     * Obtém todos os uploads de cardápio de um restaurante
     * 
     * @param int $restaurant_id - ID do restaurante
     * @return array - Lista de uploads
     */
    public function obterUploads($restaurant_id) {
        try {
            $stmt = $this->pdo->prepare(
                "SELECT * FROM menu_uploads 
                 WHERE restaurant_id = ? 
                 ORDER BY uploaded_at DESC"
            );
            $stmt->execute([$restaurant_id]);
            
            return $stmt->fetchAll();
            
        } catch (PDOException $e) {
            return [];
        }
    }
}
?>
