// Importa o driver SQLite
const sqlite3 = require('sqlite3').verbose();

// Cria a conexão com o banco SQLite no arquivo `database.sqlite`
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar com o Banco de Dados:', err.message);
        return;
    }
    console.log('✅ Conectado com o Banco de Dados SQLite');
});

// TABELA: Usuários
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150),
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(150) NOT NULL
    )`, 
    (err) => err ? console.error(err) : console.log('Tabela users pronta')
);

// TABELA: Tutores
db.run(`
    CREATE TABLE IF NOT EXISTS tutors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(150) NOT NULL,
        address VARCHAR(255) NOT NULL
    )`,
    (err) => err ? console.error(err) : console.log('Tabela tutors pronta')
);

// TABELA: Pets
db.run(`
    CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL,
        species VARCHAR(150) NOT NULL,
        breed VARCHAR(150) NOT NULL,
        age INTEGER NOT NULL,
        tutorId INTEGER NOT NULL REFERENCES tutors(id)
    )`,
    (err) => err ? console.error(err) : console.log('Tabela pets pronta')
);

// TABELA: Produtos
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL,
        price REAL NOT NULL,
        category VARCHAR(150) NOT NULL,
        stock INTEGER NOT NULL
    )`,
    (err) => err ? console.error(err) : console.log('Tabela products pronta')
);

// TABELA: Serviços
db.run(`
    CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(150) NOT NULL,
        price REAL NOT NULL,
        description VARCHAR(500)
    )`,
    (err) => err ? console.error(err) : console.log('Tabela services pronta')
);

// TABELA: Pedidos
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tutorId INTEGER NOT NULL REFERENCES tutors(id),
        petId INTEGER REFERENCES pets(id),
        total REAL NOT NULL,
        status VARCHAR(50) NOT NULL
    )`,
    (err) => err ? console.error(err) : console.log('Tabela orders pronta')
);

// TABELA: Produtos associados a pedidos
db.run(`
    CREATE TABLE IF NOT EXISTS order_product (
        orderId INTEGER NOT NULL REFERENCES orders(id),
        productId INTEGER NOT NULL REFERENCES products(id),
        prodQtd INTEGER NOT NULL,
        prodPrice REAL NOT NULL,
        prodTotal REAL GENERATED ALWAYS AS (prodQtd * prodPrice) STORED,
        PRIMARY KEY (orderId, productId)
    )`,
    (err) => err ? console.error(err) : console.log('Tabela order_product pronta')
);

// TABELA: Serviços associados a pedidos
db.run(`
    CREATE TABLE IF NOT EXISTS order_service (
        orderId INTEGER NOT NULL REFERENCES orders(id),
        serviceId INTEGER NOT NULL REFERENCES services(id),
        servQtd INTEGER NOT NULL,
        servPrice REAL NOT NULL,
        servTotal REAL GENERATED ALWAYS AS (servQtd * servPrice) STORED,
        PRIMARY KEY (orderId, serviceId)
    )`,
    (err) => err ? console.error(err) : console.log('Tabela order_service pronta')
);

// Exporta a instância do banco para uso nos models
module.exports = db;