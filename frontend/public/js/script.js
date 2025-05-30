function showLoading() {
  document.getElementById('loading').classList.remove('hide');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hide');
}

// Se clicar em "Sair", limpa localStorage
if (window.location.pathname === "/logout") {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
}

// document.addEventListener('DOMContentLoaded', carregarDashboard);

// async function carregarDashboard() {
//   const token = localStorage.getItem('token');
//   if (!token) return window.location.href = 'login.html';

//   const headers = { 'Authorization': token };

//   const [pets, tutores, servicos, produtos, pedidos] = await Promise.all([
//     fetch('/pets', { headers }).then(res => res.json()),
//     fetch('/tutores', { headers }).then(res => res.json()),
//     fetch('/services', { headers }).then(res => res.json()),
//     fetch('/products', { headers }).then(res => res.json()),
//     fetch('/orders', { headers }).then(res => res.json())
//   ]);

//   // Indicadores
//   document.getElementById('totalPets').textContent = pets.length;
//   document.getElementById('totalTutores').textContent = tutores.length;
//   document.getElementById('totalServicos').textContent = servicos.length;
//   document.getElementById('totalProdutos').textContent = produtos.length;
//   document.getElementById('totalPedidos').textContent = pedidos.length;

//   // GRÁFICO DE SERVIÇOS MAIS POPULARES
//   const servicoContagem = {};
//   pedidos.forEach(p => {
//     p.servicos?.forEach(s => {
//       servicoContagem[s.nome] = (servicoContagem[s.nome] || 0) + 1;
//     });
//   });

//   const servicoLabels = Object.keys(servicoContagem);
//   const servicoData = Object.values(servicoContagem);

//   new Chart(document.getElementById('graficoServicos'), {
//     type: 'bar',
//     data: {
//       labels: servicoLabels,
//       datasets: [{
//         label: 'Serviços',
//         data: servicoData,
//         backgroundColor: '#42a5f5'
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });

//   // GRÁFICO DE PRODUTOS MAIS VENDIDOS
//   const produtoContagem = {};
//   pedidos.forEach(p => {
//     p.produtos?.forEach(pr => {
//       produtoContagem[pr.nome] = (produtoContagem[pr.nome] || 0) + 1;
//     });
//   });

//   const produtoLabels = Object.keys(produtoContagem);
//   const produtoData = Object.values(produtoContagem);

//   new Chart(document.getElementById('graficoProdutos'), {
//     type: 'bar',
//     data: {
//       labels: produtoLabels,
//       datasets: [{
//         label: 'Produtos',
//         data: produtoData,
//         backgroundColor: '#66bb6a'
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });
// }