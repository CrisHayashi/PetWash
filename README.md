# Projeto PetShop

Sistema com funcionalidades CRUD (Criar, Ler, Atualizar, Deletar) para entidades específicas de cada tema, utilizando autenticação via JWT. A aplicação será desenvolvida com HTML, CSS e JavaScript no frontend e uma API REST em Node.js no backend, utilizando módulos/bibliotecas/pacotes necessários.

CRUD
Pets: (Nome, Espécie, Raça, Idade, Informações do Tutor, etc.)
Tutores: (Nome, Contato, Endereço, Pets associados, etc.)
Serviços: (Banho, Tosa, Consulta, Vacinação - Nome, Descrição, Preço, etc.)
Produtos: (Ração, Brinquedos, Medicamentos - Nome, Descrição, Preço, Estoque, etc.)
Solicitações/Agendamentos: (Tutor, Pet, Serviço solicitado, Data/Hora, Status, etc.)
O frontend deverá ter interfaces (tabelas, formulários modais ou em páginas separadas) para gerenciar cada uma dessas entidades. O backend deverá ter os endpoints (rotas da API) correspondentes para cada operação CRUD de cada entidade, protegidos por autenticação JWT (exceto talvez rotas públicas como login ou listagem de produtos/serviços para visualização geral).

## Tecnologias utilizadas

- Node.js
- JavaScript
- Express
- SQLite

## Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://crispy-space-xylophone-jjrgr9775q65cqr4v.github.dev/.git 
   npm install -g json-server@0.17.4
   verificar se o nodemon está instalado: nodemon -v
   npm install -g nodemon
   Se estiver usando um script no package.json, adicionar: "dev": "nodemon ./bin/www"
   E rodar com: npm run dev


# Explicação de como o projeto funciona:
1. Model (modelo)
O model vai até o banco de dados, pega informações ou coloca novas lá.
Ele não decide nada, só executa ordens. Ele só conversa com o banco de dados.
2. Controller (controlador)
O controller é tipo o chefe, ele recebe os pedidos do frontend, pede para o model buscar ou salvar algo no banco, e depois responde de volta pro frontend. Ele controla o fluxo da informação.

Por que separar em controllers e models?
Para deixar o código mais limpo e organizado.
Ficar mais fácil de entender e consertar.
Você pode reaproveitar o model em vários lugares.
É como cada um fazer só seu trabalho: ninguém se atrapalha.

backend/
├── banco/                        ← Conexão com o banco de dados SQLite
│   └── database.js               ← Arquivo que configura a conexão com o banco de dados
├── controllers/                  ← Lógica de controle para as entidades
│   ├── petsController.js         ← Controlador para pets
│   ├── tutorsController.js       ← Controlador para tutores
│   ├── productsController.js     ← Controlador para produtos
│   ├── servicesController.js     ← Controlador para serviços
│   ├── ordersController.js       ← Controlador para pedidos
│   └── usersController.js        ← Controlador para usuários, com função de login
├── models/                       ← Lógica de interação com o banco de dados
│   ├── petsModel.js              ← Modelo para pets
│   ├── tutorsModel.js            ← Modelo para tutores
│   ├── productsModel.js          ← Modelo para produtos
│   ├── servicesModel.js          ← Modelo para serviços
│   ├── ordersModel.js            ← Modelo para pedidos
│   └── usersModel.js             ← Modelo para usuários
├── routes/                       ← Definição das rotas da API
│   ├── petsRoutes.js             ← Rotas de pets
│   ├── tutorsRoutes.js           ← Rotas de tutores
│   ├── productsRoutes.js         ← Rotas de produtos
│   ├── servicesRoutes.js         ← Rotas de serviços
│   ├── ordersRoutes.js           ← Rotas de pedidos
│   ├── usersRoutes.js            ← Rotas de usuários (login e CRUD)
│   └── index.js                  ← Rota inicial da aplicação
├── auth/                         ← Arquivo de autenticação
│   ├── auth.js                   ← Função para gerar o JWT
│   └── authMiddleware.js         ← Middleware para validar o JWT nas requisições
├── app.js                        ← Ponto de entrada da aplicação
├── package.json                  ← Dependências do projeto
└── .env                          ← Arquivo para armazenar variáveis de ambiente (ex. chave secreta)


Foi implementado a autenticação JWT no backend (Node.js com Express)
Instalar dependencias necessárias:
npm install jsonwebtoken bcryptjs
