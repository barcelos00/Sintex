# 📋 GUIA: COMO SALVAR ALTERAÇÕES NO SINTEX

## 🔄 FLUXO COMPLETO DE SALVAMENTO

```
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣  FRONTEND (React/Vite)                                        │
│ Usuário edita dados no formulário de Admin                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    Clica "Salvar Restaurante"
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2️⃣  ENVIO DE DADOS (fetch PUT)                                  │
│ URL: /Pi_Final/Sintex/backend/api/restaurants.php               │
│ Método: PUT                                                      │
│ Parâmetros:                                                      │
│  - id: ID do restaurante                                         │
│  - admin_id: ID do admin logado                                  │
│                                                                   │
│ Dados enviados (JSON):                                           │
│ {                                                                 │
│   "nome": "Pizzaria Bella Italia",                               │
│   "endereco": "Rua das Flores, 123",                              │
│   "telefone": "(11) 3333-4444",                                   │
│   "email": "bella@pizzaria.com",                                  │
│   "cidade": "São Paulo",                                          │
│   "estado": "SP",                                                 │
│   "categoria": "Italiana",                                        │
│   "descricao": "...",                                             │
│   "cardapio": [...]                                               │
│ }                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3️⃣  SERVIDOR (PHP Backend)                                      │
│ Arquivo: /backend/api/restaurants.php                           │
│                                                                   │
│ • Recebe a requisição PUT                                        │
│ • Valida permissão (admin_id vs restaurante)                     │
│ • Atualiza tabela RESTAURANTES no banco                          │
│ • Atualiza tabela CARDAPIOS                                      │
│ • Retorna resposta JSON                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣  BANCO DE DADOS (MySQL)                                      │
│ Porta: 3380                                                      │
│ Banco: sintex_db                                                 │
│                                                                   │
│ UPDATE restaurantes SET                                          │
│   nome = 'Pizzaria Bella Italia',                                │
│   endereco = 'Rua das Flores, 123',                               │
│   telefone = '(11) 3333-4444',                                    │
│   email = 'bella@pizzaria.com',                                   │
│   cidade = 'São Paulo',                                           │
│   estado = 'SP'                                                   │
│ WHERE id = 1                                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5️⃣  RESPOSTA (PHP retorna JSON)                                 │
│                                                                   │
│ {                                                                 │
│   "sucesso": true,                                                │
│   "mensagem": "Restaurante atualizado com sucesso!"              │
│ }                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6️⃣  CONFIRMAÇÃO (Frontend atualiza)                             │
│                                                                   │
│ • Mensagem de sucesso exibida                                    │
│ • Estado do React atualizado                                     │
│ • Dados agora persistem no banco de dados                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 PASSO-A-PASSO NA PRÁTICA

### **PASSO 1: Acessar Painel Admin**
1. Clique em "Administrador" na navbar
2. Faça login com suas credenciais
3. Você verá a "Área do Administrador"

### **PASSO 2: Selecionar Restaurante**
1. No dropdown "Seu Restaurante", escolha qual restaurante editar
2. O formulário de edição aparecerá automaticamente

### **PASSO 3: Editar Dados**
1. Modifique os campos que desejar:
   - ✏️ Nome do Restaurante
   - ✏️ Endereço
   - ✏️ Telefone
   - ✏️ Email
   - ✏️ Cidade
   - ✏️ Estado
   - ✏️ Descrição
   - ✏️ Cardápio (adicionar/remover itens)

### **PASSO 4: Clicar em "Salvar"**
```
┌──────────────────────────────────────────┐
│  Clique no botão "Salvar" (verde)        │
│                                          │
│  O sistema vai:                          │
│  1. Validar os dados                     │
│  2. Enviar ao backend (PUT)              │
│  3. Atualizar o banco de dados           │
│  4. Mostrar mensagem de sucesso          │
└──────────────────────────────────────────┘
```

### **PASSO 5: Confirmação**
✅ Você verá uma mensagem verde: **"Alterações salvas com sucesso!"**

---

## 🔒 SEGURANÇA NA SALVAMENTO

### Validações implementadas:
✔️ **Autenticação**: Apenas usuários logados podem salvar
✔️ **Autorização**: Admin só pode editar seus próprios restaurantes
✔️ **Validação de dados**: Campos obrigatórios são checados
✔️ **Transação no BD**: Se algo falhar, tudo é revertido

---

## 📂 ARQUIVOS ENVOLVIDOS

### Frontend (React):
- [`/src/Pages/Admin/Admin.jsx`](Admin.jsx) - Painel de admin com formulário
- Função: `handleSaveRestaurant()`

### Backend (PHP):
- [`/backend/api/restaurants.php`](restaurants.php) - Endpoint PUT
- [`/backend/models/Restaurant.php`](Restaurant.php) - Método `atualizar()`

### Banco de Dados:
- Tabela: `restaurantes`
- Tabela: `cardapios`
- Tabela: `administrador_restaurante` (vinculação)

---

## 🚨 ERROS COMUNS

| Erro | Causa | Solução |
|------|-------|---------|
| "Erro ao conectar com servidor" | Vite/Apache desligados | Reiniciar `npm run dev` |
| "Acesso negado. Restaurante não é seu." | Admin tentando editar outro restaurante | Selecione seu próprio restaurante |
| "Campo obrigatório vazio" | Faltam dados no formulário | Preecha todos os campos |
| "SQLSTATE[42S22]: Column not found" | Coluna não existe no banco | Executar `/backend/setup_db.php` |

---

## ✨ RESUMO DO FLUXO

```
Editar → Clique Salvar → Validação → Fetch PUT 
  → PHP Verifica → SQL UPDATE → Resposta JSON 
  → Frontend Atualiza → Mensagem Sucesso ✅
```

