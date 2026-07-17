# Mantem o projeto em apenas uma pasta 

sem pasta dentro de pastas por favor 


# 🚀 Configuração do Banco de Dados e Login de Administrador - Sintex

## 📋 Pré-requisitos

Antes de começar, instale:

* XAMPP
* Node.js
* npm

---

# 📂 Estrutura do Projeto

O projeto deve estar localizado em:

```text
C:\xampp\htdocs\sintex\Sintex
```

Estrutura principal:

```text
Sintex/
├── php/
│   ├── db.php
│   ├── login.php
│   └── register.php
│
├── src/
├── public/
├── package.json
└── vite.config.js
```

---

# 🔥 Iniciando o XAMPP

Abra o painel do XAMPP e inicie:

* Apache
* MySQL

Os dois serviços devem aparecer como:

```text
Running
```

---

# 🗄️ Criando o Banco de Dados

Acesse:

```url
http://localhost/phpmyadmin
```

Clique em **Novo**.

Crie um banco chamado:

```sql
sintex
```

Utilize a collation:

```text
utf8mb4_unicode_ci
```

Clique em **Criar**.

---

# 📊 Criando a Tabela de Administradores

Selecione o banco **sintex**.

Abra a aba **SQL**.

Execute:

```sql
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Após executar:

```text
sintex
└── administradores
```

---

# ⚙️ Configurando a Conexão com o Banco

Arquivo:

```text
php/db.php
```

```php
<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "sintex";

$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Erro na conexão com o banco."
    ]));
}
```

---

# 📝 Backend de Cadastro

Arquivo:

```text
php/register.php
```

Funções:

* Receber dados enviados pelo React
* Verificar se o e-mail já existe
* Criptografar a senha
* Salvar administrador no banco

Criptografia utilizada:

```php
password_hash(
    $senha,
    PASSWORD_DEFAULT
);
```

---

# 🔐 Backend de Login

Arquivo:

```text
php/login.php
```

Funções:

* Receber e-mail e senha
* Buscar usuário no banco
* Comparar senha digitada com senha criptografada

Validação:

```php
password_verify(
    $senhaDigitada,
    $admin["senha"]
);
```

---

# ⚛️ Iniciando o Frontend React

Abra o terminal na raiz do projeto:

```bash
npm install
```

Depois execute:

```bash
npm run dev
```

O Vite iniciará normalmente em:

```url
http://localhost:5173
```

---

# 🌐 URL do Cadastro

Arquivo:

```text
RegisterAdmin.jsx
```

```javascript
fetch(
  "http://localhost/sintex/Sintex/php/register.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
)
```

---

# 🌐 URL do Login

Arquivo:

```text
Login.jsx
```

```javascript
fetch(
  "http://localhost/sintex/Sintex/php/login.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }
)
```

---

# 👤 Criando o Primeiro Administrador

Acesse a tela de cadastro.

Preencha:

```text
Email: teste@teste.com
Senha: 123456
Restaurante: Meu Restaurante
```

Clique em:

```text
Cadastrar
```

Resultado esperado:

```text
Administrador cadastrado com sucesso!
```

---

# ✅ Verificando o Cadastro

No phpMyAdmin:

```text
sintex
└── administradores
    └── Procurar
```

Exemplo:

| id | nome            | email                                     |
| -- | --------------- | ----------------------------------------- |
| 1  | Meu Restaurante | [teste@teste.com](mailto:teste@teste.com) |

A senha ficará armazenada criptografada:

```text
$2y$10$...
```

---

# 🔑 Testando o Login

Utilize:

```text
Email: teste@teste.com
Senha: 123456
```

Resultado esperado:

```text
Login bem-sucedido!
```

Redirecionamento:

```text
/admin
```

---

# 🛡️ Segurança

O sistema utiliza:

* Prepared Statements
* password_hash()
* password_verify()
* Validação de e-mail único

As senhas não são armazenadas em texto puro.

---

# 🛠️ Tecnologias Utilizadas

### Frontend

* React
* React Router DOM
* Vite

### Backend

* PHP 8

### Banco de Dados

* MySQL

### Servidor Local

* Apache (XAMPP)

---

# 📌 Observações

* O React roda pela porta do Vite (`5173`).
* O PHP é executado pelo Apache do XAMPP.
* O banco de dados utilizado é o MySQL do XAMPP.
* O diretório do projeto deve estar dentro da pasta `htdocs`.

---

# 👨‍💻 Projeto Sintex

Sistema de gerenciamento desenvolvido com React, PHP e MySQL.





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


-- ==========================================================
-- Adicionar Inserts.
-- ==========================================================

-- 1. Desliga as travas de segurança
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Apaga todos os dados (DELETE não sofre o bloqueio do TRUNCATE)
DELETE FROM feedbacks;
DELETE FROM cardapios;
DELETE FROM administrador_restaurante;
DELETE FROM restaurantes;
DELETE FROM administradores;

-- 3. Reseta os contadores de ID de volta para o número 1
ALTER TABLE feedbacks AUTO_INCREMENT = 1;
ALTER TABLE cardapios AUTO_INCREMENT = 1;
ALTER TABLE restaurantes AUTO_INCREMENT = 1;
ALTER TABLE administradores AUTO_INCREMENT = 1;

-- 4. Liga as travas novamente
SET FOREIGN_KEY_CHECKS = 1;

-- Isso acima apenas zera os ID's e libera colcoar eles de foram zerada.


-- 1. Inserir Administradores (IDs gerados de 1 a 12)
INSERT INTO administradores (nome, email, senha) VALUES
('Gerente Outback', 'gerencia@outback.com.br', '123456'),
('Gerente Coco Bambu', 'gerencia@cocobambu.com', '123456'),
('Gerente Lagares', 'contato@lagares.com.br', '123456'),
('Gerente Lifebox', 'sac@lifeboxburger.com', '123456'),
('Gerente Mormaii', 'lago@mormaiisurfbar.com.br', '123456'),
('Gerente Fausto e Manoel', 'pontao@faustoemanoel.com.br', '123456'),
('Gerente Mangai', 'contato@mangai.com.br', '123456'),
('Gerente Baco', 'contato@bacopizzaria.com.br', '123456'),
('Gerente Geléia', 'contato@geleia.com.br', '123456'),
('Gerente Nau', 'brasilia@naufrutosdomar.com.br', '123456'),
('Gerente Fogo de Chão', 'eventos@fogodechao.com.br', '123456'),
('Gerente Caminito', 'reservas@caminito.com.br', '123456');

-- 2. Inserir os Restaurantes (IDs gerados de 1 a 12)
INSERT INTO restaurantes (nome, categoria, descricao, endereco, telefone, email, foto_url) VALUES
('Outback Steakhouse', 'Steakhouse', 'O sabor marcante da culinária australiana com cortes de carnes especiais e aperitivos icônicos em um ambiente descontraído.', 'ParkShopping - Guará, Brasília', '(61) 3234-7958', 'parkshopping@outback.com.br', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800'),
('Coco Bambu', 'Frutos do Mar', 'Especializado em frutos do mar, o Coco Bambu possui um cardápio amplo com pratos muito bem servidos.', 'Lago Sul, Brasília', '(61) 3224-5585', 'lago@cocobambu.com', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800'),
('Lagares', 'Contemporânea', 'Uma experiência gastronômica única, unindo a tradição de pratos bem elaborados com uma excelente carta de vinhos.', 'Asa Sul, Brasília', '(61) 3322-1122', 'reserva@lagares.com.br', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'),
('Lifebox Burger', 'Hamburgueria', 'Famosa pelos hambúrgueres fartos, suculentos e cheios de queijo. Um ambiente moderno e jovem.', 'Águas Claras, Brasília', '(61) 3456-7890', 'aguasclaras@lifebox.com.br', 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800'),
('Mormaii Surf Bar', 'Sushi / Saudável', 'O clima de praia no coração de Brasília. Localizado no Pontão do Lago Sul, oferece sushis de alta qualidade e açaí.', 'Pontão do Lago Sul, Brasília', '(61) 3364-6023', 'contato@mormaiisurfbar.com.br', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800'),
('Fausto & Manoel', 'Bar e Petiscos', 'O tradicional ponto de encontro dos brasilienses. O melhor chopp gelado da cidade de frente para o lago.', 'Pontão do Lago Sul, Brasília', '(61) 3297-7013', 'reserva@faustoemanoel.com.br', 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800'),
('Mangai', 'Comida Nordestina', 'O melhor da culinária nordestina em Brasília, com pratos fartos e um ambiente temático inesquecível.', 'SCE Sul Trecho 2 - Lago Sul, Brasília', '(61) 3224-3094', 'contato@mangai.com.br', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'),
('Baco Pizzaria', 'Italiana', 'Eleita uma das melhores pizzarias do Brasil. Massa de fermentação natural e forno a lenha.', 'CLS 408 Bloco C - Asa Sul, Brasília', '(61) 3244-2292', 'contato@bacopizzaria.com.br', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'),
('Geléia Hamburgueria', 'Fast Food / Artesanal', 'Hambúrgueres artesanais com blends exclusivos de carne fresca e as famosas batatas rústicas.', 'Vicente Pires, Brasília', '(61) 98417-2475', 'contato@geleia.com.br', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'),
('Nau Frutos do Mar', 'Frutos do Mar', 'A mais alta gastronomia brasileira especializada em frutos do mar em um ambiente sofisticado.', 'Setor de Clubes Sul, Brasília', '(61) 3252-2170', 'brasilia@nau.com.br', 'https://images.unsplash.com/photo-1559742811-822873691fc8?w=800'),
('Fogo de Chão', 'Churrascaria', 'A autêntica tradição gaúcha do churrasco. Cortes premium servidos no espeto rodízio.', 'SHS Quadra 5 - Asa Sul, Brasília', '(61) 3322-4666', 'eventos@fogodechao.com.br', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'),
('Caminito Parrilla', 'Carnes / Argentina', 'Cortes de carne com inspiração argentina, feitos na parrilla com lenha e carvão.', 'SIG Quadra 8 - Sudoeste, Brasília', '(61) 3205-3300', 'reservas@caminito.com.br', 'https://images.unsplash.com/photo-1558030006-450675393462?w=800');

-- 3. Vincular donos aos restaurantes (Relação 1-1, 2-2 ... 12-12)
INSERT INTO administrador_restaurante (administrador_id, restaurante_id, permissao) VALUES
(1, 1, 'dono'), (2, 2, 'dono'), (3, 3, 'dono'), (4, 4, 'dono'),
(5, 5, 'dono'), (6, 6, 'dono'), (7, 7, 'dono'), (8, 8, 'dono'),
(9, 9, 'dono'), (10, 10, 'dono'), (11, 11, 'dono'), (12, 12, 'dono');

-- 4. Inserir os Cardápios
INSERT INTO cardapios (restaurante_id, nome_item, descricao, preco, categoria, disponivel) VALUES
(1, 'Bloomin Onion', 'A clássica cebola gigante dourada.', 'R$ 69,90', 'Aperitivos', 1),
(1, 'Ribs on the Barbie', 'Costela de porco defumada com barbecue.', 'R$ 109,90', 'Prato Principal', 1),
(2, 'Camarão Internacional', 'Camarões com arroz cremoso e queijo gratinado.', 'R$ 219,90', 'Prato Principal', 1),
(2, 'Cocada ao Forno', 'Cocada servida quente com sorvete.', 'R$ 39,90', 'Sobremesa', 1),
(3, 'Bacalhau à Lagareiro', 'Lombo de bacalhau assado com azeite e alho.', 'R$ 185,00', 'Pratos Principais', 1),
(3, 'Risoto de Funghi', 'Risoto cremoso de cogumelos frescos.', 'R$ 89,00', 'Massas', 1),
(4, 'Retrô Burger', 'Blend bovino, cheddar, bacon e cebola roxa.', 'R$ 42,90', 'Hambúrgueres', 1),
(4, 'Milkshake de Morango', 'Sorvete batido com morangos frescos.', 'R$ 28,00', 'Bebidas', 1),
(5, 'Barca de Sushi', 'Seleção especial do Chef (40 peças).', 'R$ 159,90', 'Japonês', 1),
(5, 'Açaí na Tigela', 'Açaí puro batido com banana.', 'R$ 25,00', 'Saudável', 1),
(6, 'Carne de Sol', 'Carne de sol acebolada com mandioca.', 'R$ 89,90', 'Petiscos', 1),
(6, 'Chopp Brahma', 'Chopp gelado na caneca congelada.', 'R$ 12,90', 'Bebidas', 1),
(7, 'Carne de Sol de Caicó', 'Com macaxeira, feijão verde e farofa.', 'R$ 145,90', 'Prato Principal', 1),
(7, 'Cartola', 'Banana assada com queijo manteiga e canela.', 'R$ 28,50', 'Sobremesa', 1),
(8, 'Pizza Margherita', 'Molho pelati, muçarela de búfala e manjericão.', 'R$ 78,00', 'Pizzas', 1),
(8, 'Burrata ao Forno', 'Burrata fresca assada na massa de pizza.', 'R$ 54,90', 'Entradas', 1),
(9, 'Hambúrguer Brasiliense', 'Blend de 160g, queijo prato e bacon.', 'R$ 38,90', 'Hambúrgueres', 1),
(9, 'Batata Rústica', 'Batatas com páprica e alecrim.', 'R$ 18,90', 'Acompanhamentos', 1),
(10, 'Camarão Nau', 'Camarões refogados na manteiga com ervas.', 'R$ 198,00', 'Frutos do Mar', 1),
(10, 'Polvo à Lagareiro', 'Tentáculos de polvo assados com batatas ao murro.', 'R$ 210,00', 'Frutos do Mar', 1),
(11, 'Rodízio Completo', 'Seleção de carnes nobres servidas no espeto.', 'R$ 215,00', 'Carnes', 1),
(11, 'Petit Gâteau', 'Bolo quente de chocolate com sorvete de creme.', 'R$ 45,00', 'Sobremesa', 1),
(12, 'Bife de Ancho', 'Corte argentino suculento feito na parrilla.', 'R$ 115,00', 'Carnes', 1),
(12, 'Empanada de Carne', 'Massa artesanal recheada com carne temperada.', 'R$ 18,00', 'Entradas', 1);

-- 5. Inserir os Feedbacks
INSERT INTO feedbacks (restaurante_id, nome_cliente, comentario) VALUES
(1, 'Felipe Moura', '[5 Estrelas] O pão australiano estava perfeito!'),
(1, 'Bruna Dias', '[3 Estrelas] Pedido demorou muito.'),
(2, 'Família Souza', '[5 Estrelas] Prato enorme e delicioso.'),
(2, 'Ricardo Alves', '[4 Estrelas] Bom, mas muito barulhento.'),
(3, 'Patrícia Lima', '[5 Estrelas] Bacalhau impecável.'),
(4, 'Lucas Gamer', '[5 Estrelas] Melhor hambúrguer de Águas Claras!'),
(4, 'Mariana Costa', '[2 Estrelas] Hambúrguer veio frio hoje.'),
(5, 'Surfista', '[5 Estrelas] Sushi fresquinho.'),
(5, 'Fernanda', '[3 Estrelas] Preços um pouco altos.'),
(6, 'João', '[5 Estrelas] Chopp estupidamente gelado.'),
(6, 'Camila Rocha', '[1 Estrelas] Péssimo atendimento na mesa.'),
(7, 'Carlos Silva', '[5 Estrelas] Carne de sol desmanchando!'),
(8, 'Roberto A.', '[5 Estrelas] A melhor massa da Asa Sul.'),
(8, 'Julia M.', '[3 Estrelas] As bordas da pizza vieram um pouco queimadas.'),
(9, 'Lucas F.', '[5 Estrelas] Batata rústica muito crocante.'),
(10, 'Ana Clara', '[5 Estrelas] O camarão estava divino. Ambiente super luxuoso.'),
(10, 'Pedro T.', '[3 Estrelas] Comida ótima, mas os garçons estavam confusos.'),
(11, 'Gaúcho', '[5 Estrelas] Picanha no ponto perfeito e buffet de saladas incrível.'),
(11, 'Marcos J.', '[2 Estrelas] Tivemos que pedir várias vezes para trazerem a costela.'),
(12, 'Luciana', '[4 Estrelas] Bife ancho espetacular. Só a música que estava alta.'),
(12, 'Diego S.', '[1 Estrelas] O ponto da carne passou muito, ficou dura.');