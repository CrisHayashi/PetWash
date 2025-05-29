$(document).ready(() => {
  carregarTutores();
  carregarPets();
  listarPedidos();

  $("#pedidoForm").hide();

  // Botão "Novo Pedido"
  $("#btn_novoPedido").on("click", () => {
    $("#pedidoForm").show();
    $("#table_pedido").hide();
  });

  // Botão "Cancelar"
  $("#btn_voltarPedido").on("click", (e) => {
    e.preventDefault();
    $("#pedidoForm").hide();
    $("#table_pedido").show();
    limparPedidoForm();
  });

  // Botão "Salvar Pedido"
  $("#btn_salvarPedido").on("click", (e) => {
    e.preventDefault();
    salvarPedido();
  });

  // Adicionar produto/serviço dinamicamente
  $("#btn_produtoAdd").on("click", adicionarProduto);
  $("#btn_servicoAdd").on("click", adicionarServico);
});

function carregarTutores() {
  $.get(URL_API + "/tutors", (data) => {
    const tutors = data.tutors || data;
    tutors.forEach(t => {
      $("#tutorId").append(`<option value="${t.id}">${t.name}</option>`);
    });
  });
}

function carregarPets() {
  $.get(URL_API + "/pets", (data) => {
    const pets = data.pets || data;
    pets.forEach(p => {
      $("#petId").append(`<option value="${p.id}">${p.name}</option>`);
    });
  });
}

function listarPedidos() {
  $.get(URL_API + "/orders", (data) => {
    const orders = data.orders || data;
    let html = "";
    orders.forEach(order => {
      html += `
        <tr>
          <td>${order.id}</td>
          <td>${order.tutorName || ''}</td>
          <td>${order.petName || ''}</td>
          <td>${(order.products || []).map(p => p.productName).join(", ")}</td>
          <td>${(order.services || []).map(s => s.serviceName).join(", ")}</td>
          <td>${order.status}</td>
          <td>${order.total.toFixed(2)}</td>
          <td><!-- Ações futuras aqui --></td>
        </tr>
      `;
    });
    $("#pedido_list").html(html);
  });
}

// Adiciona novo campo de produto
function adicionarProduto() {
  $.get(URL_API + "/products", (products) => {
    const select = $(`
      <div class="input-field">
        <select class="browser-default produtoSelect">
          <option value="">Selecione um produto</option>
          ${products.map(prod => `
            <option value="${prod.id}" data-price="${prod.prodPrice}">
              ${prod.productName} - R$ ${prod.prodPrice}
            </option>`).join('')}
        </select>
      </div>
    `);
    $("#produtos_container").append(select);
  });
}

// Adiciona novo campo de serviço
function adicionarServico() {
  $.get(URL_API + "/services", (services) => {
    const select = $(`
      <div class="input-field">
        <select class="browser-default servicoSelect">
          <option value="">Selecione um serviço</option>
          ${services.map(serv => `
            <option value="${serv.id}" data-price="${serv.servPrice}">
              ${serv.serviceName} - R$ ${serv.servPrice}
            </option>`).join('')}
        </select>
      </div>
    `);
    $("#servicos_container").append(select);
  });
}

// Salvar o pedido
function salvarPedido() {
  const produtos = [];
  $(".produtoSelect").each(function () {
    const id = $(this).val();
    const price = $(this).find(":selected").data("price");
    if (id) produtos.push({ productId: parseInt(id), prodPrice: parseFloat(price), prodQtd: 1 });
  });

  const servicos = [];
  $(".servicoSelect").each(function () {
    const id = $(this).val();
    const price = $(this).find(":selected").data("price");
    if (id) servicos.push({ serviceId: parseInt(id), servPrice: parseFloat(price), servQtd: 1 });
  });

  const total = calculaTotal(produtos, servicos);

  const data = {
    tutorId: $("#tutorId").val(),
    petId: $("#petId").val(),
    status: $("#status").val(),
    products: produtos,
    services: servicos,
    total: total
  };

  $.ajax({
    url: URL_API + "/orders",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: () => {
      Swal.fire("Sucesso!", "Pedido salvo com sucesso!", "success");
      listarPedidos();
      $("#pedidoForm").hide();
      $("#table_pedido").show();
      limparPedidoForm();
    },
    error: () => {
      Swal.fire("Erro!", "Erro ao salvar pedido", "error");
    }
  });
}

// Cálculo do total
function calculaTotal(produtos, servicos) {
  const totalProdutos = produtos.reduce((sum, p) => sum + (p.prodPrice * (p.prodQtd || 1)), 0);
  const totalServicos = servicos.reduce((sum, s) => sum + (s.servPrice * (s.servQtd || 1)), 0);
  const total = (totalProdutos + totalServicos).toFixed(2);
  $("#totalPedido").val(total);
  return parseFloat(total);
}

// Limpa formulário
function limparPedidoForm() {
  $("#orderId").val("");
  $("#tutorId").val("");
  $("#petId").val("");
  $("#status").val("pendente");
  $("#totalPedido").val("0.00");
  $("#produtos_container").html("");
  $("#servicos_container").html("");
}