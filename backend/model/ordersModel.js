const db = require('../banco/database');
const { all } = require('../routes/orders');

const runQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const allQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const getQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

// Função para listar todos os pedidos com produtos e serviços associados
const listarPedidos = async () => {
  try {
    const pedidos = await allQuery(`SELECT * FROM orders`);
        for (const pedido of pedidos) {
          pedido.products = await allQuery(
            `SELECT op.productId, p.name AS productName, op.prodQtd, op.prodPrice, op.prodTotal
            FROM order_product op
            JOIN products p ON p.id = op.productId
            WHERE op.orderId = ?`,
            [pedido.id]
          );
          pedido.services = await allQuery(
            `SELECT os.serviceId, s.name AS serviceName, os.servQtd, os.servPrice, os.servTotal
            FROM order_service os
            JOIN services s ON s.id = os.serviceId
            WHERE os.orderId = ?`,
            [pedido.id]
          );
        }
    return pedidos;
  } catch (error) {
    throw new Error('Erro ao listar pedidos: ' + error.message);
  }
};


// Função para buscar pedido por ID
const buscarPedidoPorId = async (id) => {
  try {
    const pedido = await getQuery(`SELECT * FROM orders WHERE id = ?`, [id]);
    if (!pedido) throw new Error('Pedido não encontrado');

    pedido.products = await allQuery(
      `SELECT op.productId, p.name AS productName, op.prodQtd, op.prodPrice, op.prodTotal
      FROM order_product op
      JOIN products p ON p.id = op.productId
      WHERE op.orderId = ?`,
      [id]
    );

    pedido.services = await allQuery(
      `SELECT os.serviceId, s.name AS serviceName, os.servQtd, os.servPrice, os.servTotal
      FROM order_service os
      JOIN services s ON s.id = os.serviceId
      WHERE os.orderId = ?`,
        [id]
    );
    return pedido;
  } catch (error) {
    throw new Error('Erro ao buscar pedido: ' + error.message);
  }
};

// Função para criar um pedido com produtos e serviços associados
const criarPedido = async (pedidoData) => {
  const { tutorId, petId, status, products = [], services = [] } = pedidoData;

    try {
        await runQuery('BEGIN TRANSACTION');

        // Insere o pedido com total 0 temporariamente
        const result = await runQuery(
          `INSERT INTO orders (tutorId, petId, total, status) VALUES (?, ?, ?, ?)`,
          [tutorId, petId, 0, status]
        );
        const orderId = result.lastID;

        // Inserir produtos
        for (const prod of products) {
          await runQuery(
            `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice)
            VALUES (?, ?, ?, ?)`,
            [orderId, prod.productId, prod.prodQtd, prod.prodPrice]
          );
        }

        // Inserir serviços
        for (const serv of services) {
          await runQuery(
            `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice)
            VALUES (?, ?, ?, ?)`,
            [orderId, serv.serviceId, serv.servQtd, serv.servPrice]
          );
        }

        // Buscar os totais calculados no banco
        const produtosTotais = await allQuery(
          `SELECT prodTotal FROM order_product WHERE orderId = ?`,
          [orderId]
        );
        const servicosTotais = await allQuery(
          `SELECT servTotal FROM order_service WHERE orderId = ?`,
          [orderId]
        );

        const totalProdutos = produtosTotais.reduce((acc, p) => acc + p.prodTotal, 0);
        const totalServicos = servicosTotais.reduce((acc, s) => acc + s.servTotal, 0);
        const total = totalProdutos + totalServicos;

        // Atualiza o total do pedido
        await runQuery(`UPDATE orders SET total = ? WHERE id = ?`, [total, orderId]);

        await runQuery('COMMIT');
        return orderId;

      } catch (err) {
        await runQuery('ROLLBACK');
        throw new Error('Erro ao criar pedido: ' + err.message);
      }
    };


// Função para atualizar um pedido com dados novos e parciais
const atualizarPedido = async (id, dadosAtualizados) => {
  try {
    // Primeiro verifica se o pedido existe
    const pedidoExistente = await getQuery('SELECT * FROM orders WHERE id = ?', [id]);
    if (!pedidoExistente) {
      throw new Error('Pedido não encontrado');
    }

    // Atualiza produtos se enviados
    if (Array.isArray(dadosAtualizados.products)) {
      await runQuery('DELETE FROM order_product WHERE orderId = ?', [id]);

      for (const prod of dadosAtualizados.products) {
        const { productId, prodQtd, prodPrice } = prod;

        if (!productId || !prodQtd || !prodPrice) {
          throw new Error('Produtos inválidos: productId, prodQtd e prodPrice são obrigatórios');
        }

        await runQuery(
          `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice)
           VALUES (?, ?, ?, ?)`,
          [id, productId, prodQtd, prodPrice]
        );
      }
    }

    // Atualiza serviços se enviados
    if (Array.isArray(dadosAtualizados.services)) {
      await runQuery('DELETE FROM order_service WHERE orderId = ?', [id]);

      for (const serv of dadosAtualizados.services) {
        const { serviceId, servQtd, servPrice } = serv;

        if (!serviceId || !servQtd || !servPrice) {
          throw new Error('Serviços inválidos: serviceId, servQtd e servPrice são obrigatórios');
        }

        await runQuery(
          `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice)
           VALUES (?, ?, ?, ?)`,
          [id, serviceId, servQtd, servPrice]
        );
      }
    }

    // Recalcular o total baseado nos valores armazenados no banco
    const produtosTotais = await allQuery(
      `SELECT prodTotal FROM order_product WHERE orderId = ?`,
      [id]
    );
    const servicosTotais = await allQuery(
      `SELECT servTotal FROM order_service WHERE orderId = ?`,
      [id]
    );

    const totalProdutos = produtosTotais.reduce((acc, p) => acc + p.prodTotal, 0);
    const totalServicos = servicosTotais.reduce((acc, s) => acc + s.servTotal, 0);
    const total = totalProdutos + totalServicos;

    // Atualiza os campos do pedido
    const campos = ['tutorId', 'petId', 'status'];
    const camposParaAtualizar = [];
    const valores = [];

    for (const campo of campos) {
      if (dadosAtualizados.hasOwnProperty(campo)) {
        camposParaAtualizar.push(`${campo} = ?`);
        valores.push(dadosAtualizados[campo]);
      }
    }

    // Atualiza também o total
    camposParaAtualizar.push('total = ?');
    valores.push(total);

    const setClause = camposParaAtualizar.join(', ');
    await runQuery(
      `UPDATE orders SET ${setClause} WHERE id = ?`,
      [...valores, id]
    );

    return true;

  } catch (err) {
    throw new Error('Erro ao atualizar pedido: ' + err.message);
  }
};

// Função para deletar pedido
const deletarPedido = async (id) => {
  const pedido = await getQuery(`SELECT * FROM orders WHERE id = ?`, [id]);
  if (!pedido) throw new Error('Pedido não encontrado');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(`DELETE FROM order_product WHERE orderId = ?`, [id], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return reject(err);
        }

        db.run(`DELETE FROM order_service WHERE orderId = ?`, [id], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          db.run(`DELETE FROM orders WHERE id = ?`, [id], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }

            db.run('COMMIT', (err) => {
              if (err) {
                db.run('ROLLBACK');
                return reject(err);
              }
              resolve();
            });
          });
        });
      });
    });
  });
};

module.exports = {
    listarPedidos,
    buscarPedidoPorId,
    criarPedido,
    atualizarPedido,
    deletarPedido
};