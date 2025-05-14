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
            git clone https://crispy-space-xylophone-jjrgr9775q65cqr4v.github.dev/.git
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

