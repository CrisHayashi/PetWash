const db = require('../banco/database'); 

// Total de produtos em estoque
const totalEstoque = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT SUM(stock) AS totalEstoque FROM products';
    db.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.totalEstoque || 0);
    });
  });
};

// Total de serviços cadastrados
const totalServicos = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS totalServicos FROM services';
    db.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.totalServicos || 0);
    });
  });
};

// Total de pedidos realizados
const totalPedidos = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS totalPedidos FROM orders';
    db.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.totalPedidos || 0);
    });
  });
};

// Total faturado (soma dos totais dos pedidos)
const totalFaturado = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT SUM(total) AS totalFaturado FROM orders';
    db.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve(row.totalFaturado || 0);
    });
  });
};

// Quantidade de pedidos por status
const pedidosPorStatus = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT status, COUNT(*) AS quantidade FROM orders GROUP BY status`;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  totalEstoque,
  totalServicos,
  totalPedidos,
  totalFaturado,
  pedidosPorStatus,
};