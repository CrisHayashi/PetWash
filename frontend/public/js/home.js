// Parse dos dados vindos do EJS
const pets = JSON.parse('<%- JSON.stringify(pets) %>');
const tutores = JSON.parse('<%- JSON.stringify(tutores) %>');
const services = JSON.parse('<%- JSON.stringify(services) %>');
const products = JSON.parse('<%- JSON.stringify(products) %>');
const pedidosData = JSON.parse('<%- JSON.stringify(orders) %>');

// Executa tudo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  preencherIndicadores();
  montarGraficoServicos();
  montarGraficoProdutos();
});

// Atualiza os indicadores numéricos
function preencherIndicadores() {
  document.getElementById('totalPets').textContent = pets.length;
  document.getElementById('totalTutores').textContent = tutores.length;
  document.getElementById('totalServicos').textContent = services.length;
  document.getElementById('totalProdutos').textContent = products.length;
  document.getElementById('totalPedidos').textContent = pedidosData.length;
}

// Monta gráfico dos 5 serviços mais populares
function montarGraficoServicos() {
  const contagemServicos = {};

  pedidosData.forEach(pedido => {
    pedido.servicos?.forEach(servico => {
      contagemServicos[servico.name] = (contagemServicos[servico.name] || 0) + 1;
    });
  });

  const topServicos = Object.entries(contagemServicos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topServicos.map(([nome]) => nome);
  const dados = topServicos.map(([, quantidade]) => quantidade);

  new Chart(document.getElementById('graficoServicos'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Quantidade de usos',
        data: dados,
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Monta gráfico dos 5 produtos mais vendidos
function montarGraficoProdutos() {
  const contagemProdutos = {};

  pedidosData.forEach(pedido => {
    pedido.produtos?.forEach(produto => {
      contagemProdutos[produto.name] = (contagemProdutos[produto.name] || 0) + 1;
    });
  });

  const topProdutos = Object.entries(contagemProdutos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topProdutos.map(([nome]) => nome);
  const dados = topProdutos.map(([, quantidade]) => quantidade);

  new Chart(document.getElementById('graficoProdutos'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Quantidade de vendas',
        data: dados,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}