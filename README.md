# Artrivium - NFT Generator and Commercialization

Plataforma para geração de NFTs usando IA e comercialização em marketplace.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend**: API RESTful em Node.js com Express
- **Frontend**: Interface de usuário em React com TypeScript

## Requisitos

- Node.js 14+
- MongoDB
- Conta em serviços de IA (OpenAI ou Stable Diffusion)

## Instalação

### Backend

```bash
cd backend
npm install
```

Configure as variáveis de ambiente criando um arquivo `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/artrivium
JWT_SECRET=seu_jwt_secret
OPENAI_API_KEY=sua_chave_api_openai
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

Configure as variáveis de ambiente criando um arquivo `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Execução

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm start
```

## Funcionalidades

- **Autenticação**: Registro e login de usuários
- **Geração de NFTs**: Criação de imagens usando IA
- **Marketplace**: Compra e venda de NFTs
- **Galeria do Usuário**: Visualização de NFTs criados e adquiridos
- **CMS**: Sistema de gerenciamento de conteúdo para administradores

## Resolução de Problemas

### Conflitos de Dependências

Se encontrar problemas com dependências no frontend, use:

```bash
npm install --legacy-peer-deps
```

Isso é necessário devido a conflitos entre as versões do TypeScript e o react-scripts.

## Licença

MIT