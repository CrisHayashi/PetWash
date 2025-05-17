const dashboardsModel = require('../model/dashboardsModel');

exports.dashboardStats = async (req, res, next) => {
  try {
    const totalEstoque = await dashboardsModel.totalEstoque();
    const totalServicos = await dashboardsModel.totalServicos();
    const totalPedidos = await dashboardsModel.totalPedidos();
    const totalFaturado = await dashboardsModel.totalFaturado();
    const statusPedidos = await dashboardsModel.pedidosPorStatus();

    res.json({
      totalEstoque,
      totalServicos,
      totalPedidos,
      totalFaturado,
      statusPedidos,
    });
  } catch (err) {
    next(err);
  }
};