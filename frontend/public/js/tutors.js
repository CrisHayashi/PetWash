<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/tutores")
    .then(response => {
      if (!response.ok) throw new Error("Erro ao buscar tutores");
      return response.json();
    })
    .then(tutores => {
      const tabela = document.querySelector("#tabelaTutores tbody");
      tabela.innerHTML = ""; // limpa conteúdo
      tutores.forEach(tutor => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${tutor.nome}</td>
          <td>${tutor.email}</td>
          <td>${tutor.telefone}</td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch(erro => {
      console.error("Erro ao carregar tutores:", erro);
      alert("Erro ao carregar tutores.");
    });
});
=======
document.addEventListener("DOMContentLoaded", function() {
    $("#form").hide();  // Esconde o formulário
    $("#table").show(); // Mostra a tabela

    listarTutores();

    const phoneElement = document.getElementById("phone");
    if (phoneElement) {
        IMask(phoneElement, {
            mask: '+55 (00) 0 0000-0000'
        });
    }
});

function listarTutores() {
    // Fazendo fetch para os tutores da API
    fetch("/tutors", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((tutors) => {
    let list = "";
    for (let tutor of tutors) {
        list += `<tr>
                <td>${tutor.name}</td>
                <td>${tutor.email}</td>
                <td>${tutor.phone}</td>
                <td>${tutor.address}</td>
                <td>
                    <a onclick="editarTutor(${tutor.id})" class="btn-floating"><i class="material-icons">edit</i></a>
                    <a onclick="deletarTutor(${tutor.id})" class="btn-floating"><i class="material-icons">delete</i></a>
                </td>
                </tr>`;
    }
    document.getElementById("tutor_list").innerHTML = list;
    });
}

function mostrarForm(){
    $("#form").show()
    $("#table").hide()
}

function cancelar() {
    $("#form").hide();
    $("#table").show();
    limparForm();
}

function limparForm(){
    $("#tutorId").val("")
    $("#name").val("")
    $("#email").val("")
    $("#phone").val("")
    $("#address").val("")
    M.updateTextFields(); // Atualiza os labels do Materialize
}

function salvar() {
    const id = $("#tutorId").val();
    const data = {
        name: $("#name").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        address: $("#address").val()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/tutors/${id}` : `/tutors`;

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        listarTutores();
        cancelar();
        Swal.fire('Sucesso!', 'Tutor salvo com sucesso.', 'success');
    })
    .catch((err) => {
        console.error(err);
        Swal.fire('Erro!', 'Não foi possível salvar o tutor.', 'error');
    });
}

function editarTutor(id) {
    fetch(`/tutors/${id}`)
        .then(res => res.json())
        .then(tutor => {
            $("#tutorId").val(tutor.id);
            $("#name").val(tutor.name);
            $("#email").val(tutor.email);
            $("#phone").val(tutor.phone);
            $("#address").val(tutor.address);

            M.updateTextFields(); // Atualiza os labels do Materialize
            mostrarForm();
        })
        .catch((err) => {
            console.error(err);
            Swal.fire('Erro!', 'Não foi possível carregar os dados do tutor.', 'error');
        });
}

function deletarTutor(id) {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
        fetch(`/tutors/${id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(() => {
            listarTutores();
            Swal.fire('Deletado!', 'O tutor foi removido.', 'success');
        })
        .catch((error) => {
            Swal.fire('Erro!', 'Não foi possível deletar o tutor.', 'error');
            console.error(error);
        });
        }
    });
}
>>>>>>> main
