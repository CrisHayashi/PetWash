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
          pedido.produtos = await allQuery(
            `SELECT productId, prodQtd, prodPrice, prodTotal FROM order_product WHERE orderId = ?`,
            [pedido.id]
          );
          pedido.servicos = await allQuery(
            `SELECT serviceId, servQtd, servPrice, servTotal FROM order_service WHERE orderId = ?`,
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

    pedido.produtos = await allQuery(
      `SELECT productId, prodQtd, prodPrice, prodTotal FROM order_product WHERE orderId = ?`,
      [id]
    );

    pedido.servicos = await allQuery(
      `SELECT serviceId, servQtd, servPrice, servTotal FROM order_service WHERE orderId = ?`,
        [id]
    );
    return pedido;
  } catch (error) {
    throw new Error('Erro ao buscar pedido: ' + error.message);
  }
};

// Função para criar um pedido com produtos e serviços associados
const criarPedido = async (pedidoData) => {
  const { tutorId, petId, total, status, produtos = [], servicos = [] } = pedidoData;

    try {
        await runQuery('BEGIN TRANSACTION');

        const result = await runQuery(
        `INSERT INTO orders (tutorId, petId, total, status) VALUES (?, ?, ?, ?)`,
        [tutorId, petId, total, status]
    );

    const orderId = result.lastID;

    // Inserir produtos sequencialmente com await
    for (const prod of produtos) {
        await runQuery(
            `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice) VALUES (?, ?, ?, ?)`,
            [orderId, prod.productId, prod.prodQtd, prod.prodPrice]
        );
    }

    // Inserir serviços sequencialmente com await
    for (const serv of servicos) {
        await runQuery(
        `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice) VALUES (?, ?, ?, ?)`,
        [orderId, serv.serviceId, serv.servQtd, serv.servPrice]
        );
    }

    await runQuery('COMMIT');
    resolve(orderId);
    } catch (err) {
    await runQuery('ROLLBACK');
    reject(err);
    }
};

// Função para calcular o total de produtos e serviços
async function calcularTotalProdutos(ids) {
  if (!ids || ids.length === 0) return 0;

  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT preco FROM produtos WHERE id IN (${placeholders})`;

  const rows = await db.all(query, ids);
  return rows.reduce((acc, item) => acc + item.preco, 0);
}

async function calcularTotalServicos(ids) {
  if (!ids || ids.length === 0) return 0;

  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT preco FROM servicos WHERE id IN (${placeholders})`;

  const rows = await db.all(query, ids);
  return rows.reduce((acc, item) => acc + item.preco, 0);
}

// Função para atualizar um pedido com dados novos e parciais
const atualizarPedido = async (id, dadosAtualizados) => {
  try {
    // Primeiro verifica se o pedido existe
    const pedidoExistente = await getQuery('SELECT * FROM orders WHERE id = ?', [id]);
    if (!pedidoExistente) {
      throw new Error('Pedido não encontrado');
    }

    // Campos possíveis que podem ser atualizados na tabela orders (exceto produtos e serviços, que são tratados à parte)
    const campos = ['tutorId', 'petId', 'total', 'status'];
    const camposParaAtualizar = [];
    const valores = [];

    for (const campo of campos) {
      if (dadosAtualizados.hasOwnProperty(campo)) {
        camposParaAtualizar.push(`${campo} = ?`);
        valores.push(dadosAtualizados[campo]);
      }
    }

    if (camposParaAtualizar.length > 0) {
      const sql = `UPDATE orders SET ${camposParaAtualizar.join(', ')} WHERE id = ?`;
      valores.push(id);
      await runQuery(sql, valores);
    }

    // Atualizar produtos, se enviado
    if (Array.isArray(dadosAtualizados.produtos)) {
      // Remove os produtos antigos do pedido
      await runQuery('DELETE FROM order_product WHERE orderId = ?', [id]);

      // Insere os novos produtos
      for (const prod of dadosAtualizados.produtos) {
        const { productId, prodQtd, prodPrice } = prod;
        if (!productId || !prodQtd || !prodPrice) {
          throw new Error('Produtos inválidos: productId, prodQtd e prodPrice são obrigatórios');
        }
        await runQuery(
          `INSERT INTO order_product (orderId, productId, prodQtd, prodPrice) VALUES (?, ?, ?, ?)`,
          [id, productId, prodQtd, prodPrice]
        );
      }
    }

    // Atualizar serviços, se enviado
    if (Array.isArray(dadosAtualizados.servicos)) {
      // Remove os serviços antigos do pedido
      await runQuery('DELETE FROM order_service WHERE orderId = ?', [id]);

      // Insere os novos serviços
      for (const serv of dadosAtualizados.servicos) {
        const { serviceId, servQtd, servPrice } = serv;
        if (!serviceId || !servQtd || !servPrice) {
          throw new Error('Serviços inválidos: serviceId, servQtd e servPrice são obrigatórios');
        }
        await runQuery(
          `INSERT INTO order_service (orderId, serviceId, servQtd, servPrice) VALUES (?, ?, ?, ?)`,
          [id, serviceId, servQtd, servPrice]
        );
      }
    }

    // Retorna o pedido atualizado completo
    return await buscarPedidoPorId(id);
  } catch (err) {
    throw new Error('Erro ao atualizar pedido: ' + err.message);
  }
};

// Função para deletar pedido
const deletarPedido = async (id) => {
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