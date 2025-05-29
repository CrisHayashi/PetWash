$(document).ready(() => {
  carregarTutores();
  carregarPets();
  listarPedidos();

  $("#pedidoForm").hide();

  $("#btn_novoPedido").on("click", () => {
    $("#pedidoForm").show();
    $("#table_pedido").hide();
  });

  $("#btn_voltarPedido").on("click", (e) => {
    e.preventDefault();
    $("#pedidoForm").hide();
    $("#table_pedido").show();
    limparPedidoForm();
  });

  $("#btn_salvarPedido").on("click", (e) => {
    e.preventDefault();
    salvarPedido();
  });

  $("#btn_produtoAdd").on("click", adicionarProduto);
  $("#btn_servicoAdd").on("click", adicionarServico);
});

// ==================== CARREGAMENTO ====================

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
          <td>${(order.products || []).map(p => p.name || p.productName).join(", ")}</td>
          <td>${(order.services || []).map(s => s.name || s.serviceName).join(", ")}</td>
          <td>${order.status}</td>
          <td>${Number(order.total).toFixed(2)}</td>
          <td><!-- Ações futuras --></td>
        </tr>
      `;
    });
    $("#pedido_list").html(html);
  });
}

// ==================== ADIÇÃO DE CAMPOS ====================

function adicionarProduto() {
  $.get(URL_API + "/products", (data) => {
    const produtos = data.products || data;

    const select = $(`
      <div class="input-field">
        <select class="browser-default produtoSelect">
          <option value="">Selecione um produto</option>
          ${produtos.map(prod => `
            <option value="${prod.id}" data-price="${prod.price}">
              ${prod.name} - R$ ${Number(prod.price).toFixed(2)}
            </option>
          `).join('')}
        </select>
      </div>
    `);

    $("#produtos_container").append(select);
    atualizarTotalAoSelecionar();
  });
}

function adicionarServico() {
  $.get(URL_API + "/services", (data) => {
    const servicos = data.services || data;

    const select = $(`
      <div class="input-field">
        <select class="browser-default servicoSelect">
          <option value="">Selecione um serviço</option>
          ${servicos.map(serv => `
            <option value="${serv.id}" data-price="${serv.price}">
              ${serv.name} - R$ ${Number(serv.price).toFixed(2)}
            </option>
          `).join('')}
        </select>
      </div>
    `);

    $("#servicos_container").append(select);
    atualizarTotalAoSelecionar();
  });
}

// ==================== CÁLCULO DO TOTAL ====================

function atualizarTotalAoSelecionar() {
  $(".produtoSelect, .servicoSelect").off("change").on("change", () => {
    const produtos = [];
    $(".produtoSelect").each(function () {
      const price = $(this).find(":selected").data("price");
      if (price) produtos.push({ prodPrice: parseFloat(price), prodQtd: 1 });
    });

    const servicos = [];
    $(".servicoSelect").each(function () {
      const price = $(this).find(":selected").data("price");
      if (price) servicos.push({ servPrice: parseFloat(price), servQtd: 1 });
    });

    calculaTotal(produtos, servicos);
  });
}

function calculaTotal(produtos, servicos) {
  const totalProdutos = produtos.reduce((sum, p) => sum + (p.prodPrice * (p.prodQtd || 1)), 0);
  const totalServicos = servicos.reduce((sum, s) => sum + (s.servPrice * (s.servQtd || 1)), 0);
  const total = (totalProdutos + totalServicos).toFixed(2);
  $("#totalPedido").val(total);
  return parseFloat(total);
}

// ==================== SALVAR PEDIDO ====================

function salvarPedido() {
  const produtos = [];
  $(".produtoSelect").each(function () {
    const id = $(this).val();
    const price = $(this).find(":selected").data("price");
    if (id) {
      produtos.push({
        productId: parseInt(id),
        prodPrice: parseFloat(price),
        prodQtd: 1
      });
    }
  });

  const servicos = [];
  $(".servicoSelect").each(function () {
    const id = $(this).val();
    const price = $(this).find(":selected").data("price");
    if (id) {
      servicos.push({
        serviceId: parseInt(id),
        servPrice: parseFloat(price),
        servQtd: 1
      });
    }
  });

  const total = calculaTotal(produtos, servicos);

  const data = {
    tutorId: parseInt($("#tutorId").val()),
    petId: parseInt($("#petId").val()),
    status: $("#status").val(),
    products: produtos,
    services: servicos,
    total: total
  };

  console.log("📤 Enviando pedido:", data); // Log para debug

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
    error: (xhr) => {
      console.error("❌ Erro ao salvar pedido:", xhr.responseText);
      Swal.fire("Erro!", "Erro ao salvar pedido", "error");
    }
  });
}

// ==================== LIMPAR FORMULÁRIO ====================

function limparPedidoForm() {
  $("#orderId").val("");
  $("#tutorId").val("");
  $("#petId").val("");
  $("#status").val("pendente");
  $("#totalPedido").val("0.00");
  $("#produtos_container").html("");
  $("#servicos_container").html("");
}