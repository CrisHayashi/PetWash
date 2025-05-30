$(document).ready(function () {
  $('.modal').modal();
  $("#petform").hide();
  $("#pettable").show();

  listarPets();
});

// Funções para mostrar/esconder loading
function mostrarLoading() {
  $("#loading").removeClass("hide");
}

function esconderLoading() {
  $("#loading").addClass("hide");
}

// Função para listar os pets
function listarPets() {
  mostrarLoading();
  $.get(URL_API + "/pets", function (data) {
    console.log("Dados recebidos:", data);
    // Verifica se a resposta é um objeto e acessa a propriedade correta
    const pets = Array.isArray(data) ? data : data.pets || [];
    if (!Array.isArray(pets)) {
      console.error("Erro: a propriedade 'pets' não é um array!", pets);
      return;
    }
    let list = "";
    pets.forEach(pet => {
      list += `
        <tr>
          <td>${pet.name}</td>
          <td>${pet.species}</td>
          <td>${pet.breed}</td>
          <td>${pet.age}</td>
          <td>${pet.tutorName || 'Não informado'}</td>
          <td>
            <div class="btn-group">
              <a onclick="visualizarPet(${pet.id})" class="btn-floating waves-effect waves-light blue"><i class="material-icons">visibility</i></a>
              <a onclick="editarPet(${pet.id})" class="btn-floating waves-effect waves-light orange"><i class="material-icons">edit</i></a>
              <a onclick="deletarPet(${pet.id})" class="btn-floating waves-effect waves-light red"><i class="material-icons">delete</i></a>
            </div>
          </td>
        </tr>`;
  });
    
    $("#pet_list").html(list);
  }).fail(function (error) {
    console.error("Erro ao buscar pets:", error);
    Swal.fire('Erro!', 'Não foi possível carregar a lista de pets.', 'error');
  })
  .always(function () {
    esconderLoading();
  });
}

// Função para visualizar um pet detalhadamente
function buscarPetPorId(id) {
  mostrarLoading();
  $.get(URL_API + `/pets/${id}`, function (pet) {
    $("#petNome").text(pet.name);
    $("#petSpecies").text(pet.species);
    $("#petBreed").text(pet.breed);
    $("#petAge").text(pet.age);
    $('#modalPet').modal();
    $("#modalPet").modal("open");
  }).fail(function (error) {
    Swal.fire('Erro!', 'Não foi possível carregar os dados do pet.', 'error');
  })
  .always(function () {
    esconderLoading();
  }); 
}

// Função para mostrar o formulário de cadastro
function mostrarForm() {
  $("#petform").show();
  $("#pettable").hide();
}

// Função para cancelar e limpar formulário
function cancelar() {
  $("#petform").hide();
  $("#pettable").show();
  limparForm();
}

// Função para limpar o formulário
function limparForm() {
  $("#petId, #name, #species, #breed, #age").val("");
  M.updateTextFields();
}

// Validação simples dos dados antes de salvar
function validarPet(data) {
  if (!data.name.trim()) {
    Swal.fire('Aviso', 'Nome é obrigatório.', 'warning');
    return false;
  }
  if (!data.species.trim()) {
    Swal.fire('Aviso', 'Espécie é obrigatório.', 'warning');
    return false;
  }
  if (!data.breed.trim()) {
    Swal.fire('Aviso', 'Raça é obrigatório.', 'warning');
    return false;
  }
  if (!data.age.trim()) {
    Swal.fire('Aviso', 'Idade é obrigatório.', 'warning');
    return false;
  }
  return true;
}

// Função para salvar novo pet ou atualizar existente
  function criarPet() {
    const id = $("#petId").val();
    const data = {
      name: $("#name").val(),
      species: $("#species").val(),
      breed: $("#breed").val(),
      age: $("#age").val(),
      tutorId: $("#tutorId").val() 
    };

    if (!validarPet(data)) return;

    const method = id ? 'PUT' : 'POST';
    const url = id ? URL_API + `/pets/${id}` : URL_API + `/pets`;

    mostrarLoading();

    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            listarPets();
            cancelar();
            Swal.fire('Sucesso!', 'Pet salvo com sucesso.', 'success');
        },
        error: function () {
            Swal.fire('Erro!', 'Não foi possível salvar o pet.', 'error');
        },
        complete: function () {
            esconderLoading();
        }
    });
}


// Função para editar um pet
function editarPet(id) {
  mostrarLoading();
  $.get(URL_API + `/pets/${id}`, function (pet) {
    $("#petId").val(pet.id);
    $("#name").val(pet.name);
    $("#species").val(pet.species);
    $("#breed").val(pet.breed);
    $("#age").val(pet.age);
    $("#tutorId").val(pet.tutorId);
    M.updateTextFields();
    mostrarForm();
  }).fail(function () {
          Swal.fire('Erro!', 'Não foi possível carregar os dados do pet.', 'error');
      })
  .always(function () {
    esconderLoading();
  }); 
}

// Função para deletar pet
function deletarPet (id) {
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
              url: URL_API + `/pets/${id}`,
              method: 'DELETE',
              success: function () {
                  listarPets();
                  Swal.fire('Deletado!', 'O pet foi removido.', 'success');
              },
              error: function () {
                  Swal.fire('Erro!', 'Não foi possível deletar o pet.', 'error');
              },
              complete: function () {
                  esconderLoading();
              } 
      });
    }
  });
}
