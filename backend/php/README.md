Criação do banco de dados com apenas as tabelas de administradores, administrador_restaurante, feedback, cardapios e restaurantes.
Sempre verificar a parde de banco de dados com o Xampp e verificar as portas em que ele esta fuincionando, nesse caso do trabalh oesta na 3306 porem no curso esta em outras portas logo pode e deve ser altera, LOCAL PRA ALTERAR: arquivo php/db.php e config/db.php PORT 3006 deve ser verificada a porta emq ue esta funcionando e alterar aqui. 
-- ==========================================================
-- SCRIPT PARA A CRIAÇÃO COMPLETA DO BANCO DE DADOS SINTEX
-- ==========================================================

-- 0. Cria o banco de dados (se não existir) e já seleciona ele

CREATE DATABASE IF NOT EXISTS sintex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex_db;

-- 1. Cria a tabela de Administradores (Donos dos restaurantes)

CREATE TABLE IF NOT EXISTS administradores (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Cria a tabela de Restaurantes (ATUALIZADA COM DESCRIÇÃO E CATEGORIA)

CREATE TABLE IF NOT EXISTS restaurantes (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) DEFAULT NULL,
    descricao TEXT DEFAULT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foto_url VARCHAR(500)
);

-- 3. Cria a tabela Intermediária (Liga o Administrador ao Restaurante)

CREATE TABLE IF NOT EXISTS administrador_restaurante (
    administrador_id INT(11) NOT NULL,
    restaurante_id INT(11) NOT NULL,
    permissao VARCHAR(50) DEFAULT 'dono',
    PRIMARY KEY (administrador_id, restaurante_id),
    FOREIGN KEY (administrador_id) REFERENCES administradores(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- 4. Cria a tabela de Cardápios (ATUALIZADA COM PREÇO EM VARCHAR)

CREATE TABLE IF NOT EXISTS cardapios (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT(11) NOT NULL,
    nome_item VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco VARCHAR(50) NOT NULL, 
    categoria VARCHAR(100),
    disponivel TINYINT(1) DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

-- 5. Cria a tabela de Feedbacks (Avaliações dos clientes)

CREATE TABLE IF NOT EXISTS feedbacks (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT(11) NOT NULL,
    nome_cliente VARCHAR(150) DEFAULT 'Cliente Anônimo',
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);