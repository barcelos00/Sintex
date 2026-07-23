# 🍽️ Sintex - Sistema de Gerenciamento de Restaurantes

O **Sintex** é um sistema de gerenciamento de restaurantes desenvolvido como projeto integrador para o curso Técnico em Programador Web do SENAC DF. A plataforma permite que administradores gerenciem dados de seus estabelecimentos (como cardápios e avaliações) e que clientes visualizem informações de forma centralizada.

A aplicação utiliza uma arquitetura Full-Stack, combinando um front-end em React com um back-end em PHP e persistência em banco de dados MySQL.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Função |
| :--- | :--- |
| **React (v19)** | Construção da interface de usuário (UI) |
| **Vite** | Build tool e servidor de desenvolvimento para o front-end |
| **CSS3** | Estilização e design responsivo |
| **PHP 8** | Lógica de back-end e API |
| **MySQL** | Banco de dados relacional para persistência |
| **XAMPP** | Servidor local (Apache e MySQL) |

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas no seu computador:

- [Node.js](https://nodejs.org/) (com npm)
- [XAMPP](https://www.apachefriends.org/) (para rodar o servidor Apache e MySQL localmente)
- Um navegador moderno (ex: Google Chrome)

## 📂 Estrutura do Projeto

O projeto deve ser clonado ou baixado e posicionado dentro da pasta `htdocs` do seu XAMPP. A estrutura principal é a seguinte:

```
Sintex/
├── backend/
│   ├── api/            # Endpoints da API (auth, menu, ratings, etc.)
│   ├── config/         # Conexão com o banco (db.php) e script SQL (database.sql)
│   └── models/         # Modelos do banco de dados (Restaurant, User, etc.)
├── src/
│   ├── Componentes/    # Componentes React reutilizáveis (Banner, Footer, Login)
│   ├── Pages/          # Páginas principais (Home, About, Admin)
│   ├── Routes/         # Proteção de rotas (RequireAdmin)
│   └── data/           # Dados estáticos e imagens
├── public/             # Arquivos públicos e imagens
├── index.html          # Ponto de entrada do Vite
├── package.json        # Dependências do Node.js
└── vite.config.js      # Configuração do Vite (inclui proxy para a API PHP)
```

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar o projeto no seu ambiente de desenvolvimento:

### 1. Iniciar os Serviços do XAMPP

1. Abra o Painel de Controle do XAMPP.
2. Inicie os serviços **Apache** e **MySQL**. Ambos devem mostrar o status como *Running*.

### 2. Configurar o Banco de Dados

1. Acesse o phpMyAdmin no seu navegador: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Clique em "Novo" para criar um banco de dados.
3. Nomeie o banco como `sintex_db` e escolha o collation `utf8mb4_unicode_ci`. Clique em "Criar".
4. Selecione o banco `sintex_db`, vá para a aba **SQL** e cole o conteúdo do arquivo `backend/config/database.sql` para criar as tabelas e inserir os dados de exemplo.

### 3. Ajustar a Conexão com o Banco

Abra o arquivo `backend/config/db.php` e verifique se as credenciais estão corretas para o seu ambiente XAMPP:

```php
<?php
$host = "localhost";
$user = "root";
$password = ""; // Em geral, a senha do root no XAMPP é vazia
$database = "sintex_db";
?>
```

### 4. Instalar as Dependências e Rodar o Front-end

1. Abra o terminal (CMD, PowerShell ou Git Bash) na raiz do projeto (`C:\xampp\htdocs\Sintex`).
2. Execute o comando para instalar as dependências do React:

```bash
npm install
```

3. Após a instalação, inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

4. O Vite fornecerá um endereço local (geralmente `http://localhost:5173`). Abra este endereço no seu navegador para acessar o Sintex.

## 🔑 Acesso de Administrador

O script SQL (`database.sql`) já inclui um usuário administrador de exemplo para facilitar os testes:

- **Email:** `joao@example.com`
- **Senha:** `123456`

> **Nota:** A senha está criptografada no banco de dados. Você pode usar o painel de login para acessar o painel administrativo com essas credenciais.

## 🛡️ Segurança e Padrões

- **Autenticação:** O sistema utiliza `password_hash()` para criptografar senhas e `password_verify()` para validação.
- **Segurança de Dados:** Todas as consultas ao banco de dados utilizam *Prepared Statements* para prevenir injeção SQL.
- **Rotas Protegidas:** O front-end implementa o componente `RequireAdmin` para impedir que usuários não logados acessem o painel de controle.

## 👥 Equipe

Projeto desenvolvido por:

- [Daniel Ferreira](https://github.com/Daniel-Ferreira19)
- [Victor Barcelos](https://github.com/barcelos00)
- [Layanne Sousa](https://github.com/layannesousa2025)
