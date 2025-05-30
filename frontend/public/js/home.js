// Executa tudo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  preencherIndicadores();
  montarGraficoServicos();
  montarGraficoProdutos();
});

// Atualiza os indicadores numéricos
function preencherIndicadores() {
  document.getElementById('totalPets').textContent = pets?.length ?? 0;
  document.getElementById('totalTutores').textContent = tutors?.length ?? 0;
  document.getElementById('totalServicos').textContent = services?.length ?? 0;
  document.getElementById('totalProdutos').textContent = products?.length ?? 0;
  document.getElementById('totalPedidos').textContent = orders?.length ?? 0;
}

// Monta gráfico dos 5 serviços mais populares
function montarGraficoServicos() {
  const contagemServicos = {};

  // Conta quantas vezes cada serviço aparece nos pedidos
  orders.forEach(order => {
    order.services?.forEach(service => {
      const nome = service.serviceName || 'Sem nome';
      contagemServicos[nome] = (contagemServicos[nome] || 0) + 1;
    });
  });

  // Pega os 5 serviços mais usados, ordenados pela quantidade
  const topServicos = Object.entries(contagemServicos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topServicos.map(([nome]) => nome);
  const dados = topServicos.map(([, quantidade]) => quantidade);

  // Configuração e renderização do gráfico
  new Chart(document.getElementById('graficoServicos'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade de Serviços',
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
      layout: {
        padding: {
          bottom: 0  
        }
      },
      scales: {
        x: {
          // Ajusta o tamanho das barras:
          barPercentage: 0.7,    // default é 0.9
          categoryPercentage: 0.8,
          ticks: {
            maxRotation: 90, 
            minRotation: 90,
            autoSkip: false,    // mostra todas as labels, sem pular
            align: 'start',       // força o alinhamento à esquerda da label
            font: {
              size: 11
            }
          },  
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Função que cria o gráfico dos 5 produtos mais vendidos
function montarGraficoProdutos() {
  const contagemProdutos = {};

  // Conta quantas vezes cada produto aparece nos pedidos
  orders.forEach(order => {
    order.products?.forEach(product => {
      const nome = product.productName || 'Sem nome';
      contagemProdutos[nome] = (contagemProdutos[nome] || 0) + 1;
    });
  });

  // Pega os 5 produtos mais vendidos, ordenados pela quantidade
  const topProdutos = Object.entries(contagemProdutos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topProdutos.map(([nome]) => nome);
  const dados = topProdutos.map(([, quantidade]) => quantidade);

  // Configuração e renderização do grafico
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
      layout: {
        padding: {
          bottom: 0  
        }
      },
      scales: {
        x: {
          // Ajusta o tamanho das barras:
          barPercentage: 0.7,    // default é 0.9
          categoryPercentage: 0.8,
          ticks: {
            maxRotation: 90, 
            minRotation: 90,
            autoSkip: false,    // mostra todas as labels, sem pular
            align: 'start',       // força o alinhamento à esquerda da label
            font: {
              size: 11
            }
          },  
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}