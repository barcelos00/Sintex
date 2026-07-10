/**
 * ============================================================================
 * BANCO DE DADOS: SINTEX
 * PLATAFORMA DE RESTAURANTES - Google Maps + Trivago + TripAdvisor
 * ============================================================================
 * 
 * INSTRUÇÕES:
 * 1. Abra o phpMyAdmin (http://localhost/phpmyadmin)
 * 2. Crie um novo banco de dados chamado "sintex_db"
 * 3. Selecione o banco e cole este script na aba "SQL"
 * 4. Execute
 * 
 * OU use o terminal:
 * mysql -u root < database.sql
 * 
 * ============================================================================
 */

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sintex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sintex_db;

-- ============================================================================
-- TABELA 1: USUÁRIOS (ADMINISTRADORES)
-- ============================================================================
/**
 * TABELA: users
 * PROPÓSITO: Armazenar dados dos administradores
 * 
 * CAMPOS:
 * - id: Identificador único (chave primária)
 * - name: Nome do administrador
 * - email: Email único para login
 * - password: Senha criptografada (bcrypt)
 * - phone: Telefone para contato
 * - created_at: Data de criação da conta
 */
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 2: RESTAURANTES
-- ============================================================================
/**
 * TABELA: restaurants
 * PROPÓSITO: Armazenar dados dos restaurantes
 * 
 * CAMPOS:
 * - id: Identificador único
 * - user_id: Proprietário (FK para users) - pode ser NULL se vir de API
 * - api_id: ID vindo de API externa (se aplicável)
 * - api_source: Origem (Google Maps, OpenStreetMap, etc)
 * - name: Nome do restaurante
 * - description: Descrição detalhada
 * - category: Tipo de restaurante (Pizzaria, Hambúrgueria, etc)
 * - phone: Telefone
 * - whatsapp: WhatsApp com link
 * - instagram: Usuário Instagram
 * - website: Site do restaurante
 * - address: Endereço completo
 * - city: Cidade
 * - state: Estado/UF
 * - zip_code: CEP
 * - latitude: Coordenada GPS
 * - longitude: Coordenada GPS
 * - google_maps_url: Link do Google Maps
 * - logo_url: URL da logo
 * - cover_image_url: URL da imagem de capa
 * - rating: Média de estrelas
 * - total_ratings: Quantidade de avaliações
 * - created_at: Data de criação
 * - updated_at: Data da última atualização
 */
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    api_id VARCHAR(100),
    api_source VARCHAR(50),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    instagram VARCHAR(100),
    website VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    google_maps_url VARCHAR(500),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_city (city),
    INDEX idx_category (category),
    INDEX idx_rating (rating),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 3: AVALIAÇÕES
-- ============================================================================
/**
 * TABELA: ratings
 * PROPÓSITO: Armazenar avaliações dos clientes
 * 
 * CAMPOS:
 * - id: Identificador único
 * - restaurant_id: Qual restaurante é avaliado (FK)
 * - customer_name: Nome do cliente
 * - customer_email: Email do cliente (opcional)
 * - rating: Nota de 1 a 5 estrelas
 * - positive_point: O que foi positivo
 * - negative_point: O que foi negativo
 * - comment: Comentário geral
 * - browser_fingerprint: Hash do navegador (para evitar duplicatas)
 * - is_positive: Se é comentário positivo (1) ou negativo (0)
 * - created_at: Data da avaliação
 */
CREATE TABLE ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    positive_point TEXT,
    negative_point TEXT,
    comment TEXT,
    browser_fingerprint VARCHAR(255),
    is_positive BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_rating (rating),
    INDEX idx_positive (is_positive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 4: CARDÁPIO - CATEGORIAS
-- ============================================================================
/**
 * TABELA: menu_categories
 * PROPÓSITO: Categorias de produtos no cardápio
 * 
 * CAMPOS:
 * - id: Identificador único
 * - restaurant_id: Qual restaurante (FK)
 * - name: Nome da categoria (Pizzas, Hambúrgueres, Bebidas, etc)
 * - description: Descrição da categoria
 * - order: Ordem de exibição
 */
CREATE TABLE menu_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    `order` INT DEFAULT 0,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 5: CARDÁPIO - PRODUTOS
-- ============================================================================
/**
 * TABELA: menu_items
 * PROPÓSITO: Produtos no cardápio
 * 
 * CAMPOS:
 * - id: Identificador único
 * - menu_category_id: Categoria (FK)
 * - restaurant_id: Qual restaurante (FK)
 * - name: Nome do produto
 * - description: Descrição
 * - price: Preço
 * - image_url: Foto do produto
 * - is_available: Se está disponível
 */
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_category_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_category_id) REFERENCES menu_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_category (menu_category_id),
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 6: CARDÁPIO - UPLOAD (PDF, JPG, PNG)
-- ============================================================================
/**
 * TABELA: menu_uploads
 * PROPÓSITO: Armazenar uploads de cardápio
 * 
 * CAMPOS:
 * - id: Identificador único
 * - restaurant_id: Qual restaurante (FK)
 * - file_type: Tipo (PDF, JPG, PNG)
 * - file_url: Caminho do arquivo
 * - file_name: Nome original do arquivo
 * - uploaded_at: Data do upload
 */
CREATE TABLE menu_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABELA 7: HORÁRIOS DE FUNCIONAMENTO
-- ============================================================================
/**
 * TABELA: business_hours
 * PROPÓSITO: Horários de funcionamento dos restaurantes
 * 
 * CAMPOS:
 * - id: Identificador único
 * - restaurant_id: Qual restaurante (FK)
 * - day_of_week: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 * - opening_time: Hora de abertura (HH:MM)
 * - closing_time: Hora de fechamento (HH:MM)
 * - is_closed: Se está fechado neste dia
 */
CREATE TABLE business_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    day_of_week INT NOT NULL,
    opening_time TIME,
    closing_time TIME,
    is_closed BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INSERTS DE EXEMPLO
-- ============================================================================

-- Inserir um usuário administrador de exemplo
INSERT INTO users (name, email, password, phone) VALUES (
    'João Silva',
    'joao@example.com',
    '$2y$10$7HfR4sPJ9Y8ZfZxZqZ9LX.eZZJvN9ZfZxZqZ9LXJvN9ZfZxZqZ9LX',
    '(11) 98765-4321'
);

-- Inserir restaurantes de exemplo
INSERT INTO restaurants (
    user_id, name, description, category, phone, whatsapp, instagram, website,
    address, city, state, zip_code, latitude, longitude, google_maps_url,
    rating, total_ratings, is_claimed
) VALUES (
    1,
    'Pizzaria do João',
    'A melhor pizzaria da cidade com ingredientes de alta qualidade',
    'Pizzaria',
    '(11) 3333-4444',
    '5511987654321',
    '@pizzariadojoao',
    'www.pizzariadojoao.com',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    -23.550520,
    -46.633309,
    'https://maps.google.com/?q=-23.550520,-46.633309',
    4.50,
    120,
    TRUE
);

-- Inserir categorias de menu
INSERT INTO menu_categories (restaurant_id, name, description, `order`) VALUES
(1, 'Pizzas Tradicionais', 'Nossas pizzas clássicas', 1),
(1, 'Bebidas', 'Cervejas e refrigerantes', 2),
(1, 'Sobremesas', 'Doces e sobremesas', 3);

-- Inserir itens do menu
INSERT INTO menu_items (menu_category_id, restaurant_id, name, description, price, is_available) VALUES
(1, 1, 'Pizza Margherita', 'Tomate, mozzarela, manjericão', 35.90, TRUE),
(1, 1, 'Pizza Pepperoni', 'Tomate, mozzarela, pepperoni', 38.90, TRUE),
(2, 1, 'Refrigerante 2L', 'Coca-Cola, Guaraná, Fanta', 8.90, TRUE),
(3, 1, 'Tiramisu', 'Clássico italiano', 15.90, TRUE);

-- Inserir avaliações de exemplo
INSERT INTO ratings (restaurant_id, customer_name, rating, positive_point, negative_point, comment, is_positive) VALUES
(1, 'Maria Santos', 5, 'Atendimento excelente', 'Nada', 'Adorei! Voltarei com certeza', TRUE),
(1, 'Carlos Oliveira', 4, 'Pizza muito saborosa', 'Demora um pouco', 'Bom custo benefício', TRUE),
(1, 'Ana Costa', 3, 'Preço ok', 'Espera muito longa', 'Pode melhorar a velocidade', FALSE);

-- Inserir horários de funcionamento
INSERT INTO business_hours (restaurant_id, day_of_week, opening_time, closing_time, is_closed) VALUES
(1, 0, '11:00:00', '23:00:00', FALSE), -- Domingo
(1, 1, '11:00:00', '23:00:00', FALSE), -- Segunda
(1, 2, '11:00:00', '23:00:00', FALSE), -- Terça
(1, 3, '11:00:00', '23:00:00', FALSE), -- Quarta
(1, 4, '11:00:00', '00:00:00', FALSE), -- Quinta
(1, 5, '11:00:00', '01:00:00', FALSE), -- Sexta
(1, 6, '11:00:00', '01:00:00', FALSE); -- Sábado

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================
-- Visualizar tabelas criadas
SHOW TABLES;

-- Ver estrutura de cada tabela
DESCRIBE users;
DESCRIBE restaurants;
DESCRIBE ratings;
DESCRIBE menu_categories;
DESCRIBE menu_items;
DESCRIBE menu_uploads;
DESCRIBE business_hours;