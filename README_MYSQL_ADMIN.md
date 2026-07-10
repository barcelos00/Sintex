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