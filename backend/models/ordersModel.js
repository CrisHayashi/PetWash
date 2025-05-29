const db = require('../banco/database');

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

const listarPedidos = async () => {
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
};

const buscarPedidoPorId = async (id) => {
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
};

const criarPedido = async ({ tutorId, petId, products = [], services = [], status }) => {
  let transactionStarted = false;

  try {
    await runQuery('BEGIN TRANSACTION');
    transactionStarted = true;

    // Insere o pedido (sem total ainda)
    const result = await runQuery(
      `INSERT INTO orders (tutorId, petId, total, status) VALUES (?, ?, ?, ?)`,
      [tutorId, petId, 0, status]
    );
    const orderId = result.lastID;

    // Insere os produtos
    for (const prod of products) {
      await runQuery(
        `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice)
         VALUES (?, ?, ?, ?)`,
        [orderId, prod.productId, prod.prodQtd, prod.prodPrice]
      );
    }

    // Insere os serviços
    for (const serv of services) {
      await runQuery(
        `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice)
         VALUES (?, ?, ?, ?)`,
        [orderId, serv.serviceId, serv.servQtd, serv.servPrice]
      );
    }

    // Calcula o total final
    const produtosTotais = await allQuery(`SELECT prodTotal FROM order_product WHERE orderId = ?`, [orderId]);
    const servicosTotais = await allQuery(`SELECT servTotal FROM order_service WHERE orderId = ?`, [orderId]);

    const totalProdutos = produtosTotais.reduce((acc, p) => acc + p.prodTotal, 0);
    const totalServicos = servicosTotais.reduce((acc, s) => acc + s.servTotal, 0);
    const total = totalProdutos + totalServicos;

    await runQuery(`UPDATE orders SET total = ? WHERE id = ?`, [total, orderId]);

    await runQuery('COMMIT');
    return orderId;

  } catch (err) {
    if (transactionStarted) {
      await runQuery('ROLLBACK').catch(rollbackErr =>
        console.error("Erro no ROLLBACK:", rollbackErr.message)
      );
    }
    throw new Error('Erro ao criar pedido: ' + err.message);
  }
};

const atualizarPedido = async (id, dadosAtualizados) => {
  const pedidoExistente = await getQuery('SELECT * FROM orders WHERE id = ?', [id]);
  if (!pedidoExistente) throw new Error('Pedido não encontrado');

  if (Array.isArray(dadosAtualizados.products)) {
    await runQuery('DELETE FROM order_product WHERE orderId = ?', [id]);
    for (const prod of dadosAtualizados.products) {
      await runQuery(
        `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice)
          VALUES (?, ?, ?, ?)`,
        [id, prod.productId, prod.prodQtd, prod.prodPrice]
      );
    }
  }

  if (Array.isArray(dadosAtualizados.services)) {
    await runQuery('DELETE FROM order_service WHERE orderId = ?', [id]);
    for (const serv of dadosAtualizados.services) {
      await runQuery(
        `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice)
         VALUES (?, ?, ?, ?, ?)`,
        [id, serv.serviceId, serv.servQtd, serv.servPrice]
      );
    }
  }

  const produtosTotais = await allQuery(`SELECT prodTotal FROM order_product WHERE orderId = ?`, [id]);
  const servicosTotais = await allQuery(`SELECT servTotal FROM order_service WHERE orderId = ?`, [id]);

  const totalProdutos = produtosTotais.reduce((acc, p) => acc + p.prodTotal, 0);
  const totalServicos = servicosTotais.reduce((acc, s) => acc + s.servTotal, 0);
  const total = totalProdutos + totalServicos;

  const campos = ['tutorId', 'petId', 'status'];
  const camposParaAtualizar = [];
  const valores = [];

  for (const campo of campos) {
    if (dadosAtualizados.hasOwnProperty(campo)) {
      camposParaAtualizar.push(`${campo} = ?`);
      valores.push(dadosAtualizados[campo]);
    }
  }

  camposParaAtualizar.push('total = ?');
  valores.push(total);

  const setClause = camposParaAtualizar.join(', ');
  await runQuery(`UPDATE orders SET ${setClause} WHERE id = ?`, [...valores, id]);

  return true;
};

const deletarPedido = async (id) => {
  const pedido = await getQuery(`SELECT * FROM orders WHERE id = ?`, [id]);
  if (!pedido) throw new Error('Pedido não encontrado');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run(`DELETE FROM order_product WHERE orderId = ?`, [id], (err) => {
        if (err) return rollback(reject, err);
        db.run(`DELETE FROM order_service WHERE orderId = ?`, [id], (err) => {
          if (err) return rollback(reject, err);
          db.run(`DELETE FROM orders WHERE id = ?`, [id], (err) => {
            if (err) return rollback(reject, err);
            db.run('COMMIT', (err) => {
              if (err) return rollback(reject, err);
              resolve();
            });
          });
        });
      });
    });
  });
};

const rollback = (reject, err) => {
  db.run('ROLLBACK', () => reject(err));
};

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
};
