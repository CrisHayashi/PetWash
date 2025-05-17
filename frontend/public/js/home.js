async function carregarServicos() {
  try {
    const res = await fetch('/services');
    if (!res.ok) throw new Error('Erro ao carregar serviços');
    const services = await res.json();
    
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = ''; // limpa lista

    services.forEach(service => {
      const li = document.createElement('li');
      li.textContent = `${service.name} — R$ ${service.price.toFixed(2)}`;
      servicesList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

async function carregarProdutos() {
  try {
    const res = await fetch('/products');
    if (!res.ok) throw new Error('Erro ao carregar produtos');
    const products = await res.json();

    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // limpa lista

    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} — R$ ${product.price.toFixed(2)}`;
      productsList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

// Carrega os dados quando a página terminar de carregar
window.addEventListener('DOMContentLoaded', () => {
  carregarServicos();
  carregarProdutos();
});