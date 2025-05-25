$(document).ready(function () {
    $("#form").hide();
    $("#table").show();

    listarOrders();
});

// 📌 Função para listar os pedidos
function listarOrders() {
    $.get(URL_API + "/orders", function (data) {
        console.log("Dados recebidos:", data);

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
                <td>${order.products}</td>
                <td>${order.services}</td>
                <td>R$${order.total.toFixed(2)}</td>
                <td>${order.status}</td>
                <td>
                    <div class="btn-group">
                        <a onclick="visualizarOrder(${order.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
                        <a onclick="editarOrder(${order.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
                        <a onclick="deletarOrder(${order.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
                    </div>
                </td>
            </tr>`;
        });

        $("#order_list").html(list);
    }).fail(function (error) {
        console.error("Erro ao buscar pedidos:", error);
    });
}

// 📌 Função para visualizar um pedido detalhadamente
function visualizarOrder(id) {
    $.get(URL_API + `/orders/${id}`, function (order) {
        $("#orderIdView").text(order.id);
        $("#orderTutorId").text(order.tutorId);
        $("#orderPetId").text(order.petId);
        $("#orderProducts").text(order.products);
        $("#orderServices").text(order.services);
        $("#orderTotal").text(order.total.toFixed(2));
        $("#orderStatus").text(order.status);

        $('#modalOrder').modal();
        $('#modalOrder').modal('open');
    }).fail(function () {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do pedido.', 'error');
    });
}

// 📌 Função para exibir o formulário
function mostrarFormOrder() {
    $("#form").show();
    $("#table").hide();
}

// 📌 Função para cancelar e limpar formulário
function cancelarOrder() {
    $("#form").hide();
    $("#table").show();
    limparFormOrder();
}

// 📌 Função para limpar o formulário
function limparFormOrder() {
    $("#orderId, #tutorId, #petId, #products, #services, #total, #status").val("");
    M.updateTextFields();
}

// 📌 Função para salvar ou atualizar um pedido
function salvarOrder() {
    const id = $("#orderId").val();
    const data = {
        tutorId: parseInt($("#tutorId").val()),
        petId: parseInt($("#petId").val()),
        products: $("#products").val().split(","),
        services: $("#services").val().split(","),
        total: parseFloat($("#total").val()),
        status: $("#status").val()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? URL_API + `/orders/${id}` : URL_API + `/orders`;

    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            listarOrders();
            cancelarOrder();
            Swal.fire('Sucesso!', 'Pedido salvo com sucesso.', 'success');
        },
        error: function () {
            Swal.fire('Erro!', 'Não foi possível salvar o pedido.', 'error');
        }
    });
}
