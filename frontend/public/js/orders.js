$(document).ready(function () {
    $('.modal').modal();
    $("#pedidoForm").hide();
    $("#table_pedido").show();
   
    listarOrders();
    carregarProdutos();
    carregarServicos();
    carregarTutores();
    carregarPets();
});


    $("#btnSalvarPedido").on("click", salvarOrder);
    $("#btn_voltarPedido").on("click", cancelarOrder);
    $("#btn_novoPedido").on("click", novoPedido);

    // Recalcular total ao alterar quantidade
    $("#produtos_container, #servicos_container").on("input", ".qtd", calcularTotal);

// LISTAR PEDIDOS
function listarOrders() {
    $.get(URL_API + "/orders", function (data) {
        // Verifica se a resposta é um objeto e acessa a propriedade correta
        const orders = Array.isArray(data) ? data : data.orders || [];
        if (!Array.isArray(orders)) {
            console.error("Erro: a propriedade 'orders' não é um array!", orders);
            return;
        }
        let list = "";
        orders.forEach(order => {
            list += `
            <tr>
                <td>${order.id}</td>
                <td>${order.tutorId}</td>
                <td>${order.petId}</td>
                <td>${order.products ? order.products.map(p => `${p.productId} (x${p.qtd})`).join(", ") : ''}
                </td>
                <td>${order.services ? order.services.map(s => `${s.serviceId} (x${s.qtd})`).join(", ") : ''}
                </td>
                <td>${order.status}</td>
                <td>R$ ${order.total.toFixed(2)}</td>
                <td>
                    <div class="btn-group">
                    <a onclick="visualizarOrder(${order.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
                    <a onclick="editarOrder(${order.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
                    <a onclick="excluirOrder(${order.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
                    </div>
                </td>
            </tr>`;
        });
        $("#pedido_list").html(list);
        $("#pedidoForm").hide();
        $("#table_pedido").show();
    });
}

function carregarTutores(callback) {
    $.get(URL_API + "/tutores", function (data) {
        let options = '<option value="" disabled selected>Escolha o tutor</option>';
        data.forEach(tutor => {
            options += `<option value="${tutor.id}">${tutor.nome}</option>`;
        });
        $("#tutorId").html(options);
        if (callback) callback();
    });
}

function carregarPets(callback) {
    $.get(URL_API + "/pets", function (data) {
        let options = '<option value="" disabled selected>Escolha o pet</option>';
        data.forEach(pet => {
            options += `<option value="${pet.id}">${pet.nome}</option>`;
        });
        $("#petId").html(options);
        if (callback) callback();
    });
}

// CARREGAR PRODUTOS
function carregarProdutos(callback) {
    $.get(URL_API + "/produtos", function (data) {
        let html = "";
        data.forEach(p => {
            html += `
            <div class="produto-item" data-id="${p.id}" style="margin-bottom: 8px;">
                <span>${p.nome} - R$${p.preco.toFixed(2)}</span>
                <input type="number" class="qtd" min="0" placeholder="Qtd" style="width: 60px; margin-left: 10px;">
            </div>`;
        });
        $("#produtos_container").html(html);
        if (callback) callback();
    });
}

// CARREGAR SERVIÇOS
function carregarServicos(callback) {
    $.get(URL_API + "/servicos", function (data) {
        let html = "";
        data.forEach(s => {
            html += `
            <div class="servico-item" data-id="${s.id}" style="margin-bottom: 8px;">
                <span>${s.nome} - R$${s.preco.toFixed(2)}</span>
                <input type="number" class="qtd" min="0" placeholder="Qtd" style="width: 60px; margin-left: 10px;">
            </div>`;
        });
        $("#servicos_container").html(html);
        if (callback) callback();
    });
}

// CALCULAR TOTAL
function calcularTotal() {
    let total = 0;

    // Somar produtos
    $("#produtos_container .produto-item").each(function () {
        const id = $(this).data("id");
        const qtd = parseInt($(this).find(".qtd").val()) || 0;
        if (qtd > 0) {
            const preco = parseFloat($(this).find("span").text().split("R$")[1]);
            total += preco * qtd;
        }
    });

    // Somar serviços
    $("#servicos_container .servico-item").each(function () {
        const id = $(this).data("id");
        const qtd = parseInt($(this).find(".qtd").val()) || 0;
        if (qtd > 0) {
            const preco = parseFloat($(this).find("span").text().split("R$")[1]);
            total += preco * qtd;
        }
    });

    $("#totalPedido").val(total.toFixed(2));
}

// Função para mostrar o formulário de cadastro
function mostrarForm() {
  $("#pedidoForm").show();
  $("#table_pedido").hide();
}


// LIMPAR FORMULÁRIO
function limparFormOrder() {
    $("#tutorId").val("").change();
    $("#petId").val("").change();
    $("#produtos_container").empty();
    $("#servicos_container").empty();
    $("#status").val("pendente").change();
    $("#totalPedido").val("0.00");
    M.updateTextFields();
}

// CANCELAR EDIÇÃO/CRIAR NOVO
function cancelarOrder() {
    limparFormOrder();
    $("#pedidoForm").hide();
    $("#table_pedido").show();
}

function novoPedido() {
    limparFormOrder();

    // Carregar selects de tutor e pet antes de mostrar formulário
    carregarTutores(() => {
        carregarPets(() => {
            $("#pedidoForm").show();
            $("#table_pedido").hide();
        });
    });
}

// SALVAR PEDIDO (POST ou PUT)
function salvarOrder() {
    const tutorId = parseInt($("#tutorId").val());
    const petId = parseInt($("#petId").val());
    const status = $("#status").val();

    if (!tutorId || !petId) {
        Swal.fire("Atenção", "Tutor e Pet são obrigatórios", "warning");
        return;
    }

    const products = [];
    $("#produtos_container .produto-item").each(function () {
        const id = $(this).data("id");
        const qtd = parseInt($(this).find(".qtd").val()) || 0;
        if (qtd > 0) products.push({ productId: id, qtd });
    });

    const services = [];
    $("#servicos_container .servico-item").each(function () {
        const id = $(this).data("id");
        const qtd = parseInt($(this).find(".qtd").val()) || 0;
        if (qtd > 0) services.push({ serviceId: id, qtd });
    });

    const total = parseFloat($("#totalPedido").val());

    if (products.length === 0 && services.length === 0) {
        Swal.fire("Atenção", "Informe pelo menos um produto ou serviço com quantidade maior que zero", "warning");
        return;
    }

    const orderData = { tutorId, petId, products, services, status, total };
    const editId = $("#pedidoForm").data("edit-id");

    if (editId) {
        // PUT para atualizar pedido existente
        $.ajax({
            url: URL_API + "/orders/" + editId,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(orderData),
            success: function () {
                Swal.fire("Sucesso", "Pedido atualizado com sucesso!", "success");
                cancelarOrder();
                listarOrders();
                $("#pedidoForm").removeData("edit-id");
            },
            error: function () {
                Swal.fire("Erro", "Não foi possível atualizar o pedido", "error");
            }
        });
    } else {
        // POST para criar novo pedido
        $.ajax({
            url: URL_API + "/orders",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(orderData),
            success: function () {
                Swal.fire("Sucesso", "Pedido salvo com sucesso!", "success");
                cancelarOrder();
                listarOrders();
            },
            error: function () {
                Swal.fire("Erro", "Não foi possível salvar o pedido", "error");
            }
        });
    }
}

// EDITAR PEDIDO - carregar dados no formulário para edição
function editarOrder(id) {
    $.get(URL_API + `/orders/${id}`, function (order) {
        $("#pedidoForm").show();
        $("#table_pedido").hide();
        $("#pedidoForm").data("edit-id", order.id);

        carregarTutores(() => {
            $("#tutorId").val(order.tutorId).change();
            carregarPets(() => {
                $("#petId").val(order.petId).change();
                $("#status").val(order.status);

        // Carregar produtos e depois preencher quantidades
        carregarProdutos(() => {
            order.products.forEach(pedidoProd => {
                const div = $(`#produtos_container .produto-item[data-id='${pedidoProd.productId}']`);
                div.find(".qtd").val(pedidoProd.qtd || pedidoProd.prodQtd || 0);
            });
            calcularTotal();
        });

        // Carregar serviços e depois preencher quantidades
        carregarServicos(() => {
            order.services.forEach(pedidoServ => {
                const div = $(`#servicos_container .servico-item[data-id='${pedidoServ.serviceId}']`);
                div.find(".qtd").val(pedidoServ.qtd || pedidoServ.servQtd || 0);
            });
            calcularTotal();
        });
    });
});
    }).fail(() => {
        Swal.fire("Erro", "Não foi possível carregar os dados do pedido", "error");
    });
}

// EXCLUIR PEDIDO
function excluirOrder(id) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Não será possível recuperar este pedido!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: URL_API + "/orders/" + id,
                type: "DELETE",
                success: function () {
                    Swal.fire("Excluído!", "Pedido excluído com sucesso.", "success");
                    listarOrders();
                },
                error: function () {
                    Swal.fire("Erro", "Não foi possível excluir o pedido.", "error");
                }
            });
        }
    });
}