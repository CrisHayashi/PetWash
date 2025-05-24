$(document).ready(function () {
  // Aplicar máscara ao telefone
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    IMask(phoneInput, {
      mask: '(00) 0 0000-0000'
    });
  }

  // Esconde o formulário no carregamento
  $("#tutorform").hide();
  $("#tutortable").show();

  // Evento para o botão Novo
  $("#btn_novoTutor").click(function () {
    mostrarForm();
  });

  // Evento para o botão Cancelar (Voltar)
  $("#btn_cancelarTutor").click(function () {
    cancelar();
  });
});

function mostrarForm() {
  $("#tutorform").show();
  $("#tutortable").hide();
}

function cancelar() {
  // Reseta o formulário e alterna a visualização
  $("#tutorform")[0].reset();
  $("#tutorform").hide();
  $("#tutortable").show();
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
  window.salvar = async function() {
    const id = $("#tutorId").val();
    const tutorData = {
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      address: $("#address").val()
    };

    if (!validarTutor(tutorData)) return;

    try {
      showLoading(); // ✅ MOSTRA LOADING
      let response;
      if (id) {
        // Atualizar tutor existente
        response = await fetch(`/tutors/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tutorData)
        });
      } else {
        // Criar novo tutor
        response = await fetch('/tutors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tutorData)
        });
      }

      if (response.ok) {
        // SweetAlert sucesso
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Tutor salvo com sucesso.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => location.reload());
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Falha ao salvar o tutor.'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Falha ao salvar o tutor.'
      });
    } finally {
    hideLoading(); // ✅ ESCONDE LOADING
    }
  };

  // Função para preencher formulário com dados para edição
  window.editarTutor = function(tutorJson) {
    const tutor = JSON.parse(tutorJson);

    $("#tutorId").val(tutor.id); // ajustar se usa outro nome
    $("#name").val(tutor.name);
    $("#email").val(tutor.email);
    $("#phone").val(tutor.phone);
    $("#address").val(tutor.address);
    M.updateTextFields();

    $("#tutorform").show();
    $("#tutortable").hide();
  };

  // Função para deletar tutor
  window.deletarTutor = async function(tutorJson) {
    const tutor = JSON.parse(tutorJson);

    Swal.fire({
      title: `Excluir tutor: ${tutor.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          showLoading(); // ✅ MOSTRA LOADING
          const response = await fetch(`/tutors/${tutor.id}`, { method: 'DELETE' });
          if (response.ok) {
            Swal.fire('Excluído!', 'Tutor removido com sucesso.', 'success').then(() => location.reload());
          } else {
            Swal.fire('Erro', 'Não foi possível excluir o tutor.', 'error');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Erro', 'Não foi possível excluir o tutor.', 'error');
        } finally {
          hideLoading(); // ✅ ESCONDE LOADING
        }
      }
    });
  };