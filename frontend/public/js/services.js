$(document).ready(function () {
    $("#form").hide();
    $("#table").show();

    listarServices();
});

// 📌 Função para listar os serviços
function listarServices() {
    $.get(URL_API + "/services", function (data) {
        console.log("Dados recebidos:", data);

        const services = Array.isArray(data) ? data : data.services || [];

        if (!Array.isArray(services)) {
            console.error("Erro: a propriedade 'services' não é um array!", services);
            return;
        }

        let list = "";
        services.forEach(service => {
            list += `
            <tr>
                <td>${service.name}</td>
                <td>R$${service.price.toFixed(2)}</td>
                <td>${service.duration}</td>
                <td>${service.description}</td>
                <td>
                    <div class="btn-group">
                        <a onclick="visualizarService(${service.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
                        <a onclick="editarService(${service.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
                        <a onclick="deletarService(${service.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
                    </div>
                </td>
            </tr>`;
        });

        $("#service_list").html(list);
    }).fail(function (error) {
        console.error("Erro ao buscar serviços:", error);
    });
}

// 📌 Função para visualizar um serviço detalhadamente
function visualizarService(id) {
    $.get(URL_API + `/services/${id}`, function (service) {
        $("#serviceNome").text(service.name);
        $("#servicePrice").text(service.price.toFixed(2));
        $("#serviceDuration").text(service.duration);
        $("#serviceDescription").text(service.description);

        $('#modalService').modal();
        $('#modalService').modal('open');
    }).fail(function () {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do serviço.', 'error');
    });
}

// 📌 Função para exibir o formulário
function mostrarFormService() {
    $("#form").show();
    $("#table").hide();
}

// 📌 Função para cancelar e limpar formulário
function cancelarService() {
    $("#form").hide();
    $("#table").show();
    limparFormService();
}

// 📌 Função para limpar o formulário
function limparFormService() {
    $("#serviceId, #name, #price, #duration, #description").val("");
    M.updateTextFields();
}

// 📌 Função para salvar ou atualizar um serviço
function salvarService() {
    const id = $("#serviceId").val();
    const data = {
        name: $("#name").val(),
        price: parseFloat($("#price").val()),
        duration: $("#duration").val(),
        description: $("#description").val()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? URL_API + `/services/${id}` : URL_API + `/services`;

    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            listarServices();
            cancelarService();
            Swal.fire('Sucesso!', 'Serviço salvo com sucesso.', 'success');
        },
        error: function () {
            Swal.fire('Erro!', 'Não foi possível salvar o serviço.', 'error');
        }
    });
}

// 📌 Função para editar um serviço
function editarService(id) {
    $.get(URL_API + `/services/${id}`, function (service) {
        $("#serviceId").val(service.id);
        $("#name").val(service.name);
        $("#price").val(service.price);
        $("#duration").val(service.duration);
        $("#description").val(service.description);

        M.updateTextFields();
        mostrarFormService();
    }).fail(function () {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do serviço.', 'error');
    });
}

// 📌 Função para deletar um serviço
function deletarService(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: URL_API + `/services/${id}`,
                method: 'DELETE',
                success: function () {
                    listarServices();
                    Swal.fire('Deletado!', 'O serviço foi removido.', 'success');
                },
                error: function () {
                    Swal.fire('Erro!', 'Não foi possível deletar o serviço.', 'error');
                }
            });
        }
    });
}
