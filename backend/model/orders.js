const fs = require('fs');
const banco = 'orders';
const order_products = 'order_products';
const order_services = 'order_services';
const db = require('../banco/database');

function pegarPedidos(res, next) {
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
        FROM ${banco} AS orders
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
        GROUP BY orders.id, tutors.name, pets.name, orders.total, orders.status
        ;`, [], (err, data) => {

        if (err) {
            console.error(err);
            return next(err);
        }
        return res.json(data);
    });
}

function pegarPedidoPorId(req, res, next) {
    const id = Number(req.params.id);
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
            ${banco} AS orders
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
            orders.id, tutors.name, pets.name, orders.total, orders.status
        ;`, [id], [], (err, data) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (data.length === 0) {
            console.error(err);
            return res.json('Não encontrado');
        }
        return res.json(data);
    });
}

function criarPedido(req, res) {
    const corpo = req.body;

    for (let key in corpo) {
        if (key.trim() === "") {
            return res.json('Preencha todos os campos!');
        }
    }

    db.run(`INSERT INTO ${banco} 
                    (tutorId, petId, products, services, total, status)
                    values
                    (?, ?, ?, ?, ?, ?)
                    `, [corpo.tutorId, corpo.petId, corpo.products, corpo.services, corpo.total, corpo.status], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao inserir o elemento' });
        }

        let orderId = this.lastID;
        let products = JSON.parse(req.body.products);
        let services = JSON.parse(req.body.services);

        // Contar a quantidade de cada produto
        let qtdProduto = products.reduce((contagem, productId) => {
            contagem[productId] = (contagem[productId] || 0) + 1;
            return contagem;
        }, {});

        // Inserir produtos no banco pedido_produtos
        Object.entries(qtdProduto).forEach(([productId, quantidade]) => {
            db.run(`INSERT INTO ${order_products}
                    (orderId, productId, quantidade)
                    values
                    (?, ?, ?)`, [orderId, productId, quantidade], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao inserir o elemento OP' });
                }
            });
        });

        // Contar a quantidade de cada serviço
        let qtdServico = services.reduce((contagem, serviceId) => {
            contagem[serviceId] = (contagem[serviceId] || 0) + 1;
            return contagem;
        }, {});

        // Inserir serviços no banco
        Object.entries(qtdServico).forEach(([serviceId, quantidade]) => {
            db.run(`INSERT INTO ${order_services}
                    (orderId, serviceId, quantidade)
                    values
                    (?, ?, ?)`, [orderId, serviceId, quantidade], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao inserir o elemento OS' });
                }
            });
        });

        return res.json('Todos os produtos e Serviços foram inseridos!');
    });
}

function atualizarPedido(req, res) {
    const id = Number(req.params.id);
    const corpo = req.body;

    // recupera o pedido com base no id
    db.get(`SELECT * FROM ${banco} WHERE id= ?`, [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar o pedido' });
        }
        if (!row) {
            return res.json('Pedido não encontrado.');
        }

        // copia todos os elementos do corpo da requisição para adentro do array novoCorpo
        // caso não encontre no corpo, usa o que esta no pedido do banco de dados
        const novoCorpo = {
            tutorId: corpo.tutorId || row.tutorId,
            petId: corpo.petId || row.petId,
            total: corpo.total || row.total,
            status: corpo.status || row.status,
        };

        // atualiza o pedido com base nas informações de novoCorpo (menos produtos e serviços)
        db.run(`UPDATE ${banco} 
            SET tutorId=?, petId=?, total=?, status=?
            WHERE id=?`, [novoCorpo.tutorId, novoCorpo.petId, novoCorpo.total, novoCorpo.status, id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar o pedido' });
            }

            // apaga os antigos elementos da tabela que faz a comunicação entre produto e pedido, com base no id
            db.run(`DELETE FROM ${order_products} WHERE orderId=?`, [id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao remover produtos antigos' });
                }

                let products = JSON.parse(corpo.products || '[]'); // converte os produtos para JSON e caso não tenha nada, retorna um array vazio []

                // conta a quantidade de cada produto que foi passado pelo corpo da requisição
                
                // contagem é quem vai guardar a quantidade de cada produto, contagem é um objeto vazio inicialmente {}
                // productId é o id do produto que foi passado pelo corpo da requisição
                let qtdProduto = products.reduce((contagem, productId) => {
                    contagem[productId] = (contagem[productId] || 0) + 1; // se contagem[productId], soma 1, e se for 0, insere o 0 e soma 1
                    return contagem; // retorna um objeto com a contagem de cada productId, exemplo {1: 1, 2: 5, 3: 4, 4: 2}
                }, {});

                Object.entries(qtdProduto).forEach(([productId, quantidade]) => {
                    db.run(`INSERT INTO ${order_products}
                            (orderId, productId, quantidade)
                            values
                            (?, ?, ?)`, [id, productId, quantidade], function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Erro ao inserir produtos atualizados' });
                        }
                    });
                });
            });

            // a mesma lógica de produtos será aplicada a serviços
            db.run(`DELETE FROM ${order_services} WHERE orderId=?`, [id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao remover serviços antigos' });
                }

                let services = JSON.parse(corpo.services || '[]');
                let qtdServico = services.reduce((contagem, serviceId) => {
                    contagem[serviceId] = (contagem[serviceId] || 0) + 1;
                    return contagem;
                }, {});

                Object.entries(qtdServico).forEach(([serviceId, quantidade]) => {
                    db.run(`INSERT INTO ${order_services}
                            (orderId, serviceId, quantidade)
                            values
                            (?, ?, ?)`, [id, serviceId, quantidade], function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Erro ao inserir serviços atualizados' });
                        }
                    });
                });
            });

            return res.json('Pedido atualizado com sucesso!');
        });
    });
}

function apagarPedido(req, res) {
    const id = Number(req.params.id);

    db.get(`SELECT * FROM ${banco} WHERE id=?`, [id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar o pedido' });
        }
        if (!row) {
            return res.status(404).json('Id não encontrado');
        }
        // código caso encontre o pedido

        db.run(`DELETE FROM ${order_products} WHERE orderId=?`, [id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao remover produtos antigos' });
            }
        });
        db.run(`DELETE FROM ${order_services} WHERE orderId=?`, [id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao remover serviços antigos' });
            }
        });
        db.run(`DELETE FROM ${banco} WHERE id=?`, [id], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao remover o pedido' });
            }
            return res.json('Pedido removido com sucesso!');
        });
    });
}

module.exports = {
    pegarPedidos,
    pegarPedidoPorId,
    criarPedido,
    atualizarPedido,
    apagarPedido
};