🐾 Projeto PetShop

   Sistema fullstack com funcionalidades completas de CRUD (Criar, Ler, Atualizar e Deletar) para gerenciamento de um PetShop. A aplicação inclui autenticação via JWT, frontend com HTML, CSS e JavaScript, e backend com API REST em Node.js e banco de dados SQLite.

📋 Funcionalidades

   CRUD para as seguintes entidades:

      Pets: Nome, espécie, raça, idade, informações do tutor etc.

      Tutores: Nome, telefone, e-mail, endereço, pets associados etc.

      Serviços: Banho, tosa, consulta, vacinação (nome, descrição, preço, duração etc.).

      Produtos: Ração, brinquedos, medicamentos (nome, preço, categoria, estoque etc.).

      Agendamentos/Solicitações/Pedidos: Tutor, pet, serviço solicitado, data/hora, status etc.

   O frontend possui interfaces (tabelas, formulários, modais ou páginas separadas) para gerenciar cada entidade.
   O backend oferece rotas protegidas por autenticação JWT (exceto login e rotas públicas como listagem de produtos/serviços).

🚀 Tecnologias Utilizadas

   Backend
      Node.js
      Express
      SQLite
      JWT (jsonwebtoken)
      BcryptJS
      Dotenv

   Frontend
      HTML, CSS e JavaScript
      SweetAlert
      IMask (para máscaras de input)
      Chart.js (para dashboards)

🗃️ Estrutura do Projeto (Backend)

   backend/
   ├── app.js                      ← Ponto de entrada da aplicação
   ├── .env                        ← Variáveis de ambiente (JWT_SECRET etc.)
   ├── banco/
   │   └── database.js             ← Configuração da conexão SQLite
   ├── auth/
   │   ├── auth.js                 ← Geração do token JWT
   │   └── authMiddleware.js       ← Validação do token nas requisições
   ├── controllers/                ← Lógica de controle das entidades
   │   ├── petsController.js
   │   ├── tutorsController.js
   │   ├── productsController.js
   │   ├── servicesController.js
   │   ├── ordersController.js
   │   └── usersController.js
   ├── models/                     ← Acesso ao banco de dados
   │   ├── petsModel.js
   │   ├── tutorsModel.js
   │   ├── productsModel.js
   │   ├── servicesModel.js
   │   ├── ordersModel.js
   │   └── usersModel.js
   ├── routes/                     ← Rotas da API
   │   ├── petsRoutes.js
   │   ├── tutorsRoutes.js
   │   ├── productsRoutes.js
   │   ├── servicesRoutes.js
   │   ├── ordersRoutes.js
   │   ├── usersRoutes.js
   │   └── index.js
   └── package.json

🗃️ Estrutura do Projeto (Frontend)
   frontend/
   ├── routes/
   │   └── index.js        ← Rotas da home page e dos partials
   ├── views/
   │   ├── layout/
   │   │   └── layout.ejs  ← Template base
   │   ├── pages/
   │   │   └── index.ejs   ← Conteúdo da home page
   │   └── partials/
   │       ├── header.ejs
   │       ├── navbar.ejs
   │       ├── footer.ejs
   │       ├── loading.ejs
   │       └── janelaAlerta.ejs
   ├── public/js/
   │   └── init.js         ← Carrega os partials


🔐 Autenticação

   A autenticação no backend é feita via JWT.
   Instalação das dependências:
      npm install jsonwebtoken bcryptjs dotenv

📦 Como Executar o Projeto

   Pré-requisitos
      Node.js instalado
      SQLite (ou DB compatível já incluído)

   Passo a passo
      1. Clone o repositório:
         git clone https://crispy-space-xylophone-jjrgr9775q65cqr4v.github.dev/.git
      2. Acesse o diretório e instale as dependências:
         cd backend
         npm install
      3. Instale o nodemon para desenvolvimento (opcional):
         npm install -g nodemon
      4. Configure o script no package.json:
         "scripts": {
         "dev": "nodemon ./bin/www",
         "start": "node ./bin/www"
         }
      5. Crie o arquivo .env com base em env.example:
         cp env.example .env
      6. Inicie o servidor:
         npm run dev

🧠 Entendendo a Estrutura MVC

   Model: acessa o banco de dados, executa ações (buscar, salvar, deletar).

   Controller: recebe requisições do frontend, interage com os models e devolve respostas.

   Separação de responsabilidades facilita manutenção, testes e reuso do código.

📄 Licença

   Este projeto está sob a licença MIT (./LICENSE).
   Sinta-se à vontade para utilizar, modificar e compartilhar com atribuição.