🐾 PetShop Project

    Fullstack system with complete CRUD (Create, Read, Update, Delete) operations to manage a PetShop. The application includes JWT-based authentication, a frontend built with HTML, CSS and JavaScript, and a backend using Node.js, Express, and SQLite.

📋 Features
    
    CRUD operations available for the following entities:

        Pets: Name, species, breed, age, tutor information, etc.

        Tutors: Name, phone, e-mail, address, associated pets, etc.

        Services: Bath, grooming, consultation, vaccination (name, description, price, etc.)

        Products: Food, toys, medications (name, description, price, category, stock, etc.)

        Appointments/Requests/orders: Tutor, pet, requested service, date/time, status, etc.

    The frontend provides interfaces (tables, forms, modals or dedicated pages) to manage each entity.
    The backend offers protected API routes with JWT authentication (except public routes like login or product/service listings).

🚀 Technologies Used

    Backend
        Node.js
        Express
        SQLite
        JWT (jsonwebtoken)
        BcryptJS
        Dotenv

    Frontend
        HTML, CSS, JavaScript
        SweetAlert
        IMask (for input masks)
        Chart.js (for dashboard graphs)

🗃️ Project Structure (Backend)

    backend/
    ├── app.js                      ← Application entry point
    ├── .env                        ← Environment variables (e.g., JWT_SECRET)
    ├── banco/
    │   └── database.js             ← SQLite database connection configuration
    ├── auth/
    │   ├── auth.js                 ← JWT generation function
    │   └── authMiddleware.js       ← Middleware for JWT validation
    ├── controllers/                ← Business logic for each entity
    │   ├── petsController.js
    │   ├── tutorsController.js
    │   ├── productsController.js
    │   ├── servicesController.js
    │   ├── ordersController.js
    │   └── usersController.js
    ├── models/                     ← Database access logic
    │   ├── petsModel.js
    │   ├── tutorsModel.js
    │   ├── productsModel.js
    │   ├── servicesModel.js
    │   ├── ordersModel.js
    │   └── usersModel.js
    ├── routes/                     ← API route definitions
    │   ├── petsRoutes.js
    │   ├── tutorsRoutes.js
    │   ├── productsRoutes.js
    │   ├── servicesRoutes.js
    │   ├── ordersRoutes.js
    │   ├── usersRoutes.js
    │   └── index.js
    └── package.json

🗃️ Project Structure (Frontend)

    frontend/
    │
    ├── app.js
    ├── .env
    ├── package.json
    │
    ├── /bin
    │   └── www
    │
    ├── /public
    │   ├── /css
    │   ├── /js
    │   │   ├── init.js
    │   │   ├── script.js
    │   │   ├── pets.js
    │   │   └── tutors.js
    │   └── /libs
    │
    ├── /routes
    │   ├── index.js          ← Página inicial e rotas genéricas (ex: /, /partials/:name)
    │   ├── pets.js           ← Rotas da entidade Pets (/pets)
    │   ├── tutors.js         ← Rotas da entidade Tutores (/tutors)
    │   ├── products.js       ← Rotas de Produtos (/products)
    │   ├── services.js       ← Rotas de Serviços (/services)
    │   └── orders.js         ← Rotas de Pedidos (/orders)
    │
    ├── /views
    │   ├── error.ejs
    │   ├── index.ejs          ← Página inicial
    │   │
    │   ├── /layout
    │   │   └── layout.ejs     ← Template base com <%- body %>
    │   │
    │   ├── /partials
    │   │   ├── header.ejs
    │   │   ├── footer.ejs
    │   │   ├── navbar.ejs
    │   │   ├── loading.ejs
    │   │   └── janelaAlerta.ejs
    │   │
    │   └── /pages
    │       ├── pets.ejs       ← Página que aparece no layout
    │       ├── tutors.ejs
    │       ├── products.ejs
    │       ├── services.ejs
    │       └── orders.ejs

🔐 Authentication

    The backend uses JWT authentication.
    To install the necessary dependencies:
        npm install jsonwebtoken bcryptjs dotenv

📦 How to Run the Project

    Requirements
        Node.js installed
        SQLite (or just use the built-in file-based SQLite)

    Setup
        1. Clone the repository:
            git clone https://super-duper-garbanzo-976x6w559wg627rj9-3000.app.github.dev/.git
        2. Navigate to the backend folder and install dependencies:
            cd backend
            npm install
        3. (Optional) Install nodemon for development:
            npm install -g nodemon
        4. Add script to package.json if needed:
            "scripts": {
            "dev": "nodemon ./bin/www",
            "start": "node ./bin/www"
            }
        5. Create your .env file from the template:
            cp env.example .env
        6. Run the server:
            npm run dev

🧠 Understanding the MVC Structure

    Model: communicates directly with the database (fetching/saving data).

    Controller: handles incoming requests, interacts with models, and returns responses.

    This separation of concerns keeps the codebase organized, reusable, and easier to maintain.

📄 License

    This project is licensed under the MIT License (./LICENSE).
    Feel free to use, modify, and distribute it with proper attribution.

