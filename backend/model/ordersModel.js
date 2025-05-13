const table = 'orders';
const order_products = 'order_products';
const order_services = 'order_services';
const db = require('../banco/database');

// Função para listar todos os pedidos
const listarPedidos = async () => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    orders.id AS idPedido,
                    tutors.name AS tutorName,
                    pets.name AS petName,
                    prod.productNames,
                    prod.quantidadeProduto,
                    serv.serviceNames,
                    serv.quantidadeServico,
                    orders.total AS total,
                    orders.status AS status
                FROM ${table} AS orders
                LEFT JOIN tutors ON tutors.id = orders.tutorId
                LEFT JOIN pets ON pets.id = orders.petId
                LEFT JOIN (
                    SELECT order_products.orderId, 
                        GROUP_CONCAT(DISTINCT products.name) AS productNames,
                        SUM(order_products.quantidade) AS quantidadeProduto
                    FROM ${order_products}
                    LEFT JOIN products ON products.id = ${order_products}.productId
                    GROUP BY order_products.orderId
                ) AS prod ON prod.orderId = orders.id
                LEFT JOIN (
                    SELECT order_services.orderId, 
                        GROUP_CONCAT(DISTINCT services.name) AS serviceNames,
                        SUM(order_services.quantidade) AS quantidadeServico
                    FROM ${order_services}
                    LEFT JOIN services ON services.id = ${order_services}.serviceId
                    GROUP BY order_services.orderId
                ) AS serv ON serv.orderId = orders.id
                GROUP BY orders.id, tutors.name, pets.name, orders.total, orders.status;
            `, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        return data;
    } catch (err) {
        throw new Error('Erro ao listar pedidos: ' + err.message);
    }
};

// Função para buscar pedido por ID
const buscarPedidoPorId = async (id) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    orders.id AS idPedido,
                    tutors.name AS tutorName,
                    pets.name AS petName,
                    GROUP_CONCAT(products.name) AS productNames,
                    ${order_products}.quantidade AS quantidade,
                    orders.total AS total,
                    orders.status AS status
                FROM
                    ${table} AS orders
                JOIN
                    tutors ON tutors.id = orders.tutorId
                JOIN
                    pets ON pets.id = orders.petId
                JOIN
                    ${order_products} ON ${order_products}.orderId = orders.id
                JOIN
                    products ON products.id = ${order_products}.productId
                WHERE 
                    orders.id = ?
                GROUP BY 
                    orders.id, tutors.name, pets.name, orders.total, orders.status;
            `, [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        return data.length > 0 ? data : null;
    } catch (err) {
        throw new Error('Erro ao buscar pedido por ID: ' + err.message);
    }
};

// Função para criar um pedido
const criarPedido = async (pedidoData) => {
    const { tutorId, petId, products, services, total, status, datetime } = pedidoData;
    
    try {
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO ${table} 
                (tutorId, petId, products, services, total, status, datetime)
                VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [tutorId, petId, products, services, total, status, datetime],
                function (err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                });
        });

        const orderId = result;
        await Promise.all([
            ...products.map(productId => {
                return new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO ${order_products}
                        (orderId, productId, quantidade)
                        VALUES (?, ?, ?)`, 
                        [orderId, productId, 1], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                });
            }),
            ...services.map(serviceId => {
                return new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO ${order_services}
                        (orderId, serviceId, quantidade)
                        VALUES (?, ?, ?)`, 
                        [orderId, serviceId, 1], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                });
            })
        ]);

        return orderId;
    } catch (err) {
        throw new Error('Erro ao criar pedido: ' + err.message);
    }
};

// Função para atualizar um pedido
const atualizarPedido = async (id, pedidoData) => {
    const { tutorId, petId, total, status, datetime, products, services } = pedidoData;

    try {
        // Atualizar os dados principais do pedido
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE ${table} 
                SET tutorId = ?, petId = ?, total = ?, status = ?, datetime = ?
                WHERE id = ?`, 
                [tutorId, petId, total, status, datetime, id], function (err) {
                    if (err) reject(err);
                    resolve();
                });
        });

        // Limpar produtos e serviços antigos
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${order_products} WHERE orderId = ?`, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${order_services} WHERE orderId = ?`, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // Inserir novos produtos e serviços
        await Promise.all([
            ...products.map(productId => {
                return new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO ${order_products}
                        (orderId, productId, quantidade)
                        VALUES (?, ?, ?)`, 
                        [id, productId, 1], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                });
            }),
            ...services.map(serviceId => {
                return new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO ${order_services}
                        (orderId, serviceId, quantidade)
                        VALUES (?, ?, ?)`, 
                        [id, serviceId, 1], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                });
            })
        ]);

        return id;
    } catch (err) {
        throw new Error('Erro ao atualizar pedido: ' + err.message);
    }
};

// Função para deletar pedido
const deletarPedido = async (id) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${order_products} WHERE orderId = ?`, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${order_services} WHERE orderId = ?`, [id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                resolve();
            });
        });

        return id;
    } catch (err) {
        throw new Error('Erro ao apagar pedido: ' + err.message);
    }
};

module.exports = {
    listarPedidos,
    buscarPedidoPorId,
    criarPedido,
    atualizarPedido,
    deletarPedido
};