$(document).ready(function () {
  $('.modal').modal();
  $("#tutorform").hide();
  $("#tutortable").show();

  listarTutores();
  
  
  // Aplicar máscara ao telefone
  const phoneElement = document.getElementById("phone");
  if (phoneElement) {
    IMask(phoneElement, { mask: '(00) 0 0000-0000'});
  }
});

// Funções para mostrar/esconder loading
function mostrarLoading() {
  $("#loading").removeClass("hide");
}

function esconderLoading() {
  $("#loading").addClass("hide");
}

// Função para listar os tutores
function listarTutores() {
  mostrarLoading();
  $.get(URL_API + "/tutors", function (data) {
    console.log("Dados recebidos:", data);
    // Verifica se a resposta é um objeto e acessa a propriedade correta
    const tutors = Array.isArray(data) ? data : data.tutors || [];
    if (!Array.isArray(tutors)) {
      console.error("Erro: a propriedade 'tutors' não é um array!", tutors);
      return;
    }
    let list = "";
    tutors.forEach(tutor => {
      list += `
        <tr>
          <td>${tutor.name}</td>
          <td>${tutor.email}</td>
          <td>${tutor.phone}</td>
          <td>${tutor.address}</td>
          <td>
            <div class="btn-group">
              <a onclick="visualizarTutor(${tutor.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
              <a onclick="editarTutor(${tutor.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
              <a onclick="deletarTutor(${tutor.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
            </div>
          </td>
        </tr>`;
  });
    
    $("#tutor_list").html(list);
  }).fail(function (error) {
    console.error("Erro ao buscar tutores:", error);
    Swal.fire('Erro!', 'Não foi possível carregar a lista de tutores.', 'error');
  })
  .always(function () {
    esconderLoading();
  });
}

// Função para visualizar um tutor detalhadamente
function buscarTutorPorId(id) {
  mostrarLoading();
  $.get(URL_API + `/tutors/${id}`, function (tutor) {
    $("#tutorNome").text(tutor.name);
    $("#tutorEmail").text(tutor.email);
    $("#tutorPhone").text(tutor.phone);
    $("#tutorAddress").text(tutor.address);
    $('#modalTutor').modal();
    $("#modalTutor").modal("open");
  }).fail(function (error) {
    Swal.fire('Erro!', 'Não foi possível carregar os dados do tutor.', 'error');
  })
  .always(function () {
    esconderLoading();
  }); 
}

// Função para mostrar o formulário de cadastro
function mostrarForm() {
  $("#tutorform").show();
  $("#tutortable").hide();
}

// Função para cancelar e limpar formulário
function cancelar() {
  $("#tutorform").hide();
  $("#tutortable").show();
  limparForm();
}

// Função para limpar o formulário
function limparForm() {
  $("#tutorId, #name, #email, #phone, #address").val("");
  M.updateTextFields();
}

// Validação simples dos dados antes de salvar
function validarTutor(data) {
  if (!data.name.trim()) {
    Swal.fire('Aviso', 'Nome é obrigatório.', 'warning');
    return false;
  }
  if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) {
    Swal.fire('Aviso', 'Email inválido.', 'warning');
    return false;
  }
  if (!data.phone.trim()) {
    Swal.fire('Aviso', 'Telefone é obrigatório.', 'warning');
    return false;
  }
  return true;
}

// Função para salvar novo tutor ou atualizar existente
  function criarTutor() {
    const id = $("#tutorId").val();
    const data = {
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      address: $("#address").val()
    };

    if (!validarTutor(data)) return;

    const method = id ? 'PUT' : 'POST';
    const url = id ? URL_API + `/tutors/${id}` : URL_API + `/tutors`;

    mostrarLoading();

    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            listarTutores();
            cancelar();
            Swal.fire('Sucesso!', 'Tutor salvo com sucesso.', 'success');
        },
        error: function () {
            Swal.fire('Erro!', 'Não foi possível salvar o tutor.', 'error');
        },
        complete: function () {
            esconderLoading();
        }
    });
}


// Função para editar um tutor
function editarTutor(id) {
  mostrarLoading();
  $.get(URL_API + `/tutors/${id}`, function (tutor) {
    $("#tutorId").val(tutor.id);
    $("#name").val(tutor.name);
    $("#email").val(tutor.email);
    $("#phone").val(tutor.phone);
    $("#address").val(tutor.address);
    M.updateTextFields();
    mostrarForm();
  }).fail(function () {
          Swal.fire('Erro!', 'Não foi possível carregar os dados do tutor.', 'error');
      })
  .always(function () {
    esconderLoading();
  }); 
}

// Função para deletar tutor
function deletarTutor (id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      mostrarLoading();
      $.ajax({
              url: URL_API + `/tutors/${id}`,
              method: 'DELETE',
              success: function () {
                  listarTutores();
                  Swal.fire('Deletado!', 'O tutor foi removido.', 'success');
              },
              error: function () {
                  Swal.fire('Erro!', 'Não foi possível deletar o tutor.', 'error');
              },
              complete: function () {
                  esconderLoading();
              } 
      });
    }
  });
}
