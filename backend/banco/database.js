const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        console.log('Erro ao conectar com o Banco de Dados');
        return;
    }
    console.log('Conectado com o Banco de Dados');
});

//Tabela de Usuários
db.serialize(() => {
    db.run(
       `CREATE TABLE IF NOT EXISTS users (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name VARCHAR(150) NOT NULL,
           email VARCHAR(150) NOT NULL UNIQUE,
           password VARCHAR(150) NOT NULL
       )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//Tabela de tutores
db.serialize(() => {
    db.run(
       `CREATE TABLE IF NOT EXISTS tutors (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name VARCHAR(150) NOT NULL,
           email VARCHAR(150) NOT NULL UNIQUE,
           phone VARCHAR(150) NOT NULL,
           address VARCHAR(255) NOT NULL
       )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//Tabela de pets
db.serialize(() => {
    db.run(
       `CREATE TABLE IF NOT EXISTS pets (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name VARCHAR(150) NOT NULL,
           species VARCHAR(150) NOT NULL,
           breed VARCHAR(150) NOT NULL,
           age INTEGER NOT NULL,
           tutorId INTEGER NOT NULL REFERENCES tutors(id)
       )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//Tabela de produtos
db.serialize(() => {
    db.run(
       `CREATE TABLE IF NOT EXISTS products (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name VARCHAR(150) NOT NULL,
           price REAL NOT NULL,
           category VARCHAR(150) NOT NULL,
           stock INTEGER NOT NULL
       )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//Tabela de serviços
db.serialize(() => {
    db.run(
       `CREATE TABLE IF NOT EXISTS services (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name VARCHAR(150) NOT NULL,
           price INTEGER NOT NULL,
           duration VARCHAR(10),
           description VARCHAR(500) 
       )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//tabela de agendamentos
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tutorId INTEGER NOT NULL REFERENCES tutors(id),
            petId INTEGER REFERENCES pets(id),
            products TEXT,
            services TEXT,
            total REAL NOT NULL,
            status VARCHAR(50) NOT NULL
        )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

//Tabela de produtos e serviços do agendamento
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS order_product (
            orderId INTEGER NOT NULL REFERENCES orders(id),
            productId INTEGER NOT NULL REFERENCES products(id),
            prodQtd INTEGER NOT NULL,
            prodPrice REAL NOT NULL,
            prodTotal REAL GENERATED ALWAYS AS (prodQtd * prodPrice) STORED,
            PRIMARY KEY (orderId, productId)
        )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS order_service (
            orderId INTEGER NOT NULL REFERENCES orders(id),
            serviceId INTEGER NOT NULL REFERENCES services(id),
            servQtd INTEGER NOT NULL,
            servPrice REAL NOT NULL,
            servTotal REAL GENERATED ALWAYS AS (servQtd * servPrice) STORED,
            PRIMARY KEY (orderId, serviceId)
        )`, (err) => {
        if (err) {
            throw new Error(`Erro ao criar tabela de pedidos: ${err.message}`);
        }
        console.log('Tabela de pedidos criada ou já existe.');
    });
});




module.exports = db;