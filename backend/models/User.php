<?php
/**
 * ARQUIVO: models/User.php
 * PROPÓSITO: Classe para gerenciar usuários (administradores)
 * 
 * EXPLICAÇÃO:
 * Esta classe contém métodos para:
 * - Criar novo usuário
 * - Fazer login (verificar email e senha)
 * - Obter dados do usuário
 * - Atualizar perfil
 */

require_once __DIR__ . '/../config/db.php';

class User {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getDB();
    }
    
    /**
     * MÉTODO: criar()
     * Cria um novo usuário (administrador)
     * 
     * @param string $name - Nome completo
     * @param string $email - Email único
     * @param string $password - Senha em texto plano
     * @param string $phone - Telefone (opcional)
     * @return array - Resposta de sucesso ou erro
     */
    public function criar($name, $email, $password, $phone = null) {
        try {
            // Verificar se email já existe
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                return ['sucesso' => false, 'mensagem' => 'Email já cadastrado'];
            }
            
            // Criptografar senha com bcrypt
            // password_hash é função nativa do PHP muito segura
            $senhaHasheada = password_hash($password, PASSWORD_BCRYPT);
            
            // Inserir novo usuário
            $stmt = $this->pdo->prepare(
                "INSERT INTO users (name, email, password, phone) 
                 VALUES (?, ?, ?, ?)"
            );
            
            $stmt->execute([$name, $email, $senhaHasheada, $phone]);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Usuário criado com sucesso',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => 'Erro ao criar usuário: ' . $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: login()
     * Verifica email e senha para fazer login
     * 
     * @param string $email - Email do usuário
     * @param string $password - Senha em texto plano
     * @return array - Dados do usuário se sucesso, ou erro
     */
    public function login($email, $password) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() === 0) {
                return ['sucesso' => false, 'mensagem' => 'Email não encontrado'];
            }
            
            $usuario = $stmt->fetch();
            
            // password_verify verifica se a senha é correta
            // Compara a senha em texto plano com o hash armazenado
            if (!password_verify($password, $usuario['password'])) {
                return ['sucesso' => false, 'mensagem' => 'Senha incorreta'];
            }
            
            // Remover senha da resposta por segurança
            unset($usuario['password']);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Login bem-sucedido',
                'usuario' => $usuario
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => 'Erro ao fazer login'];
        }
    }
    
    /**
     * MÉTODO: obter()
     * Obtém dados completos de um usuário pelo ID
     * 
     * @param int $id - ID do usuário
     * @return array - Dados do usuário
     */
    public function obter($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT id, name, email, phone, created_at FROM users WHERE id = ?");
            $stmt->execute([$id]);
            
            return $stmt->fetch();
            
        } catch (PDOException $e) {
            return null;
        }
    }
    
    /**
     * MÉTODO: atualizar()
     * Atualiza dados do usuário
     * 
     * @param int $id - ID do usuário
     * @param array $dados - Dados a atualizar
     * @return array - Resposta de sucesso ou erro
     */
    public function atualizar($id, $dados) {
        try {
            $permitidos = ['name', 'phone'];
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
            $sql = "UPDATE users SET " . implode(', ', $atualizacoes) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($valores);
            
            return ['sucesso' => true, 'mensagem' => 'Usuário atualizado'];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => 'Erro ao atualizar'];
        }
    }
}
?>
