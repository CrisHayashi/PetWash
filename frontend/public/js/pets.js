$(document).ready(() => {
    const apiUrl = '/pets';
    const tutorsUrl = '/tutors';

    async function carregarPets() {
        try {
        const res = await fetch(apiUrl);
        const pets = await res.json();
        $('#pet_list').empty();
        pets.forEach(pet => {
            $('#pet_list').append(`
                <tr>
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed}</td>
                <td>${pet.age}</td>
                <td>${pet.tutor?.name || 'Sem tutor'}</td>
                <td>
                <button class="btn-small orange btn-editar" data-id="${pet.id}">Editar</button>
                <button class="btn-small red btn-excluir" data-id="${pet.id}">Excluir</button>
                </td>
            </tr>
            `);
        });
        } catch (error) {
        Swal.fire('Erro!', 'Não foi possível carregar os pets.', 'error');
        console.error(error);
        }
    }

    async function carregarTutores() {
        try {
        const res = await fetch(tutorsUrl);
        const tutores = await res.json();
        $('#tutorId').empty().append('<option value="">Selecione um tutor</option>');
        tutores.forEach(tutor => {
            $('#tutorId').append(`<option value="${tutor.id}">${tutor.name}</option>`);
        });
        } catch (error) {
        Swal.fire('Erro!', 'Erro ao carregar tutores.', 'error');
        }
    }

    async function salvarPet() {
        const id = $('#btn_salvarPet').data('edit-id');
        const pet = {
            name: $('#name').val(),
            species: $('#species').val(),
            breed: $('#breed').val(),
            age: $('#age').val(),
            tutorId: $('#tutorId').val()
        };

        // Validação simples
        if (!pet.name || !pet.species || !pet.breed || !pet.age || !pet.tutorId) {
        Swal.fire('Atenção!', 'Preencha todos os campos.', 'warning');
        return;
        }

        try {
        const res = await fetch(id ? `${apiUrl}/${id}`: apiUrl, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet)
        });

        if (res.ok) {
            Swal.fire('Sucesso!', `Pet ${id ? 'atualizado' : 'cadastrado'} com sucesso.`, 'success');
            carregarPets();
            $('#petForm')[0].reset();
            $('#btn_salvarPet').removeData('edit-id').text('Salvar');
        } else {
            const erro = await res.json();
            Swal.fire('Erro!', erro.message || 'Erro ao salvar o pet.', 'error');
        }
        } catch (error) {
        Swal.fire('Erro!', 'Erro ao conectar com o servidor.', 'error');
        }
    }

    async function editarPet(id) {
        try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error('Pet não encontrado');
        const pet = await res.json();

            $('#name').val(pet.name);
            $('#species').val(pet.species);
            $('#breed').val(pet.breed);
            $('#age').val(pet.age);
            $('#tutorId').val(pet.tutorId);

        $('#btn_salvarPet').data('edit-id', id).text('Atualizar');
        } catch (error) {
        Swal.fire('Erro!', error.message || 'Erro ao carregar pet.', 'error');
        }
    }


    async function excluirPet(id) {
        const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
        try {
            const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (res.ok) {
            Swal.fire('Excluído!', 'O pet foi removido.', 'success');
            carregarPets();
            } else {
            Swal.fire('Erro!', 'Não foi possível excluir o pet.', 'error');
            }
        } catch (error) {
            Swal.fire('Erro!', 'Erro de conexão ao excluir o pet.', 'error');
        }
        }
    }

    // Delegação de eventos
    $('#pet_list').on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        editarPet(id);
    });

    $('#pet_list').on('click', '.btn-excluir', function () {
        const id = $(this).data('id');
        excluirPet(id);
    });

    // Eventos principais
    $('#btn_salvarPet').on('click', salvarPet);
    $('#btn_voltarPet').on('click', () => window.location.href = '/');

    $('#btn_novoPet').on('click', () => {
        $('#petForm')[0].reset(); // limpa os campos
        $('#btn_salvarPet').removeData('edit-id').text('Salvar'); // reseta o botão
    });

    // Inicialização
    carregarPets();
    carregarTutores();
});