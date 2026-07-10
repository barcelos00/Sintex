<?php

/**
 * ARQUIVO: models/Restaurant.php
 * PROPÓSITO: Gerenciar restaurantes (Adaptado para o banco em Português com Fotos e Feedbacks)
 */

require_once __DIR__ . '/../config/db.php';

class Restaurant
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = getDB();
    }

    // ========================================================================
    // MÉTODOS PÚBLICOS (Para a página HOME - Visão do Cliente)
    // ========================================================================

    public function listar($filtros = [], $limite = 10, $pagina = 1)
    {
        try {
            $offset = ($pagina - 1) * $limite;
            $sql = "SELECT * FROM restaurantes WHERE 1=1";
            $parametros = [];

            // Filtro de busca na Home
            if (!empty($filtros['busca'])) {
                $sql .= " AND (nome LIKE ? OR endereco LIKE ?)";
                $parametros[] = "%{$filtros['busca']}%";
                $parametros[] = "%{$filtros['busca']}%";
            }

            // A CORREÇÃO MÁGICA: Concatena os inteiros direto no SQL!
            $sql .= " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($parametros);
            $restaurantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Busca os cardápios e feedbacks
            foreach ($restaurantes as &$rest) {
                $stmtCard = $this->pdo->prepare("SELECT id, nome_item, preco, descricao FROM cardapios WHERE restaurante_id = ?");
                $stmtCard->execute([$rest['id']]);
                $rest['cardapio'] = $stmtCard->fetchAll(PDO::FETCH_ASSOC);

                $stmtFeed = $this->pdo->prepare("SELECT id, nome_cliente, comentario, criado_em FROM feedbacks WHERE restaurante_id = ? ORDER BY criado_em DESC");
                $stmtFeed->execute([$rest['id']]);
                $rest['feedbacks'] = $stmtFeed->fetchAll(PDO::FETCH_ASSOC);
            }

            return $restaurantes;
        } catch (PDOException $e) {
            return [];
        }
    }

    public function obter($id)
    {
        try {
            // Obter dados principais do restaurante
            $stmt = $this->pdo->prepare("SELECT * FROM restaurantes WHERE id = ?");
            $stmt->execute([$id]);
            $restaurante = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$restaurante) return null;

            // Puxando o cardápio
            $stmtMenu = $this->pdo->prepare("SELECT id, nome_item, preco, descricao FROM cardapios WHERE restaurante_id = ?");
            $stmtMenu->execute([$id]);
            $restaurante['cardapio'] = $stmtMenu->fetchAll(PDO::FETCH_ASSOC);

            // Puxando os feedbacks
            $stmtFeed = $this->pdo->prepare("SELECT id, nome_cliente, comentario, criado_em FROM feedbacks WHERE restaurante_id = ? ORDER BY criado_em DESC");
            $stmtFeed->execute([$id]);
            $restaurante['feedbacks'] = $stmtFeed->fetchAll(PDO::FETCH_ASSOC);

            return $restaurante;
        } catch (PDOException $e) {
            return null;
        }
    }

    // ========================================================================
    // MÉTODOS PRIVADOS (Para a página ADMIN - Visão do Dono)
    // ========================================================================

    public function listarPorAdmin($admin_id)
    {
        try {
            // Pega APENAS os restaurantes que pertencem ao administrador logado
            $sql = "SELECT r.* FROM restaurantes r
                    INNER JOIN administrador_restaurante ar ON r.id = ar.restaurante_id
                    WHERE ar.administrador_id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$admin_id]);
            $restaurantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($restaurantes as &$rest) {
                // Busca o cardápio
                $sqlCardapio = "SELECT id, nome_item, preco, descricao FROM cardapios WHERE restaurante_id = ?";
                $stmtCard = $this->pdo->prepare($sqlCardapio);
                $stmtCard->execute([$rest['id']]);
                $rest['cardapio'] = $stmtCard->fetchAll(PDO::FETCH_ASSOC);

                // Busca os feedbacks para mostrar no Dashboard
                $sqlFeedback = "SELECT id, nome_cliente, comentario, criado_em FROM feedbacks WHERE restaurante_id = ? ORDER BY criado_em DESC";
                $stmtFeed = $this->pdo->prepare($sqlFeedback);
                $stmtFeed->execute([$rest['id']]);
                $rest['feedbacks'] = $stmtFeed->fetchAll(PDO::FETCH_ASSOC);
            }

            return $restaurantes;
        } catch (PDOException $e) {
            return [];
        }
    }

    public function atualizar($id, $admin_id, $dados)
    {
        try {
            // SEGURANÇA: Verificar se o restaurante realmente pertence a este admin
            $sqlCheck = "SELECT restaurante_id FROM administrador_restaurante 
                         WHERE restaurante_id = ? AND administrador_id = ?";
            $stmtCheck = $this->pdo->prepare($sqlCheck);
            $stmtCheck->execute([$id, $admin_id]);

            if ($stmtCheck->rowCount() === 0) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado. Este restaurante não é seu.'];
            }

            // Inicia a transação
            $this->pdo->beginTransaction();

            // 1. Atualiza TODOS os dados básicos do Restaurante (agora incluindo cidade/estado)
            $sqlUpd = "UPDATE restaurantes SET nome = ?, categoria = ?, descricao = ?, endereco = ?, cidade = ?, estado = ?, telefone = ?, foto_url = ? WHERE id = ?";
            $stmtUpd = $this->pdo->prepare($sqlUpd);
            $stmtUpd->execute([
                $dados['nome'] ?? 'Restaurante Sem Nome',
                $dados['categoria'] ?? null,
                $dados['descricao'] ?? null,
                $dados['endereco'] ?? null,
                $dados['cidade'] ?? $dados['city'] ?? null,
                $dados['estado'] ?? $dados['state'] ?? null,
                $dados['telefone'] ?? null,
                $dados['foto'] ?? null,
                $id
            ]);

            // 2. Atualiza o Cardápio
            if (isset($dados['cardapio']) && is_array($dados['cardapio'])) {
                $sqlDelMenu = "DELETE FROM cardapios WHERE restaurante_id = ?";
                $stmtDelMenu = $this->pdo->prepare($sqlDelMenu);
                $stmtDelMenu->execute([$id]);

                if (count($dados['cardapio']) > 0) {
                    $sqlInsMenu = "INSERT INTO cardapios (restaurante_id, nome_item, preco, descricao) VALUES (?, ?, ?, ?)";
                    $stmtInsMenu = $this->pdo->prepare($sqlInsMenu);

                    foreach ($dados['cardapio'] as $item) {
                        if (!empty($item['dish'])) {
                            $stmtInsMenu->execute([
                                $id,
                                $item['dish'],
                                $item['price'] ?? '',
                                $item['description'] ?? ''
                            ]);
                        }
                    }
                }
            }

            $this->pdo->commit();
            return ['sucesso' => true, 'mensagem' => 'Restaurante atualizado com sucesso!'];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }

    // ========================================================================
    // MÉTODOS DE ESTRUTURA (Criar e Deletar)
    // ========================================================================

    public function criar($user_id, $dados)
    {
        try {
            // Insere o restaurante
            // Agora armazenamos também cidade e estado (aceitamos 'cidade'/'estado' ou 'city'/'state')
            $sql = "INSERT INTO restaurantes (nome, endereco, telefone, email, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);

            $stmt->execute([
                $dados['nome'] ?? $dados['name'] ?? 'Novo Restaurante',
                $dados['endereco'] ?? $dados['address'] ?? null,
                $dados['telefone'] ?? $dados['phone'] ?? null,
                $dados['email'] ?? null,
                $dados['cidade'] ?? $dados['city'] ?? null,
                $dados['estado'] ?? $dados['state'] ?? null
            ]);

            $restaurante_id = $this->pdo->lastInsertId();

            // Vincula o administrador como 'dono'
            $sqlVinculo = "INSERT INTO administrador_restaurante (administrador_id, restaurante_id, permissao) VALUES (?, ?, 'dono')";
            $stmtVinculo = $this->pdo->prepare($sqlVinculo);
            $stmtVinculo->execute([$user_id, $restaurante_id]);

            return [
                'sucesso' => true,
                'mensagem' => 'Restaurante criado',
                'id' => $restaurante_id
            ];
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }

    public function deletar($id, $user_id)
    {
        try {
            // Verifica permissão
            $stmt = $this->pdo->prepare("SELECT * FROM administrador_restaurante WHERE restaurante_id = ? AND administrador_id = ?");
            $stmt->execute([$id, $user_id]);

            if ($stmt->rowCount() === 0) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado'];
            }

            // Deleta o restaurante (Cardápios e Feedbacks devem apagar juntos se o BD tiver ON DELETE CASCADE configurado)
            $stmtDel = $this->pdo->prepare("DELETE FROM restaurantes WHERE id = ?");
            $stmtDel->execute([$id]);

            return ['sucesso' => true, 'mensagem' => 'Restaurante deletado com sucesso'];
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
}
