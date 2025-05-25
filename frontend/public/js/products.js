$(document).ready(function () {
    $("#form").hide();
    $("#table").show();

    listarProdutos();
});

// 📌 Função para listar os produtos
function listarProdutos() {
    $.get(URL_API + "/products", function (data) {
        console.log("Dados recebidos:", data);

        const products = Array.isArray(data) ? data : data.products || [];

        if (!Array.isArray(products)) {
            console.error("Erro: a propriedade 'products' não é um array!", products);
            return;
        }

        let list = "";
        products.forEach(product => {
            list += `
            <tr>
                <td>${product.name}</td>
                <td>R$${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="btn-group">
                        <a onclick="visualizarProduto(${product.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
                        <a onclick="editarProduto(${product.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
                        <a onclick="deletarProduto(${product.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
                    </div>
                </td>
            </tr>`;
        });

        $("#product_list").html(list);
    }).fail(function (error) {
        console.error("Erro ao buscar produtos:", error);
    });
}

// 📌 Função para visualizar um produto detalhadamente
function visualizarProduto(id) {
    $.get(URL_API + `/products/${id}`, function (product) {
        $("#productNome").text(product.name);
        $("#productPrice").text(product.price.toFixed(2));
        $("#productCategory").text(product.category);
        $("#productStock").text(product.stock);

        $('#modalProduct').modal();
        $('#modalProduct').modal('open');
    }).fail(function () {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do produto.', 'error');
    });
}

// 📌 Função para exibir o formulário
function mostrarFormProduto() {
    $("#form").show();
    $("#table").hide();
}

// 📌 Função para cancelar e limpar formulário
function cancelarProduto() {
    $("#form").hide();
    $("#table").show();
    limparFormProduto();
}

// 📌 Função para limpar o formulário
function limparFormProduto() {
    $("#productId, #name, #price, #category, #stock").val("");
    M.updateTextFields();
}

// 📌 Função para salvar ou atualizar um produto
function salvarProduto() {
    const id = $("#productId").val();
    const data = {
        name: $("#name").val(),
        price: parseFloat($("#price").val()),
        category: $("#category").val(),
        stock: parseInt($("#stock").val())
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? URL_API + `/products/${id}` : URL_API + `/products`;

    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            listarProdutos();
            cancelarProduto();
            Swal.fire('Sucesso!', 'Produto salvo com sucesso.', 'success');
        },
        error: function () {
            Swal.fire('Erro!', 'Não foi possível salvar o produto.', 'error');
        }
    });
}

// 📌 Função para editar um produto
function editarProduto(id) {
    $.get(URL_API + `/products/${id}`, function (product) {
        $("#productId").val(product.id);
        $("#name").val(product.name);
        $("#price").val(product.price);
        $("#category").val(product.category);
        $("#stock").val(product.stock);

        M.updateTextFields();
        mostrarFormProduto();
    }).fail(function () {
        Swal.fire('Erro!', 'Não foi possível carregar os dados do produto.', 'error');
    });
}

// 📌 Função para deletar um produto
function deletarProduto(id) {
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
                url: URL_API + `/products/${id}`,
                method: 'DELETE',
                success: function () {
                    listarProdutos();
                    Swal.fire('Deletado!', 'O produto foi removido.', 'success');
                },
                error: function () {
                    Swal.fire('Erro!', 'Não foi possível deletar o produto.', 'error');
                }
            });
        }
    });
}
