// Funções para mostrar/esconder loading
function mostrarLoading() {
  $("#loading").removeClass("hide");
}

function esconderLoading() {
  $("#loading").addClass("hide");
}

document.addEventListener('DOMContentLoaded', function () {
    // Esconde o formulário de registro e mostra o de login ao carregar a página
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'block';

    M.updateTextFields(); // Materialize: garante campos flutuantes visuais
});

function mostrarLogin() {
    console.log("teste botão hiden2");
    $("#login").show();
    $("#register").hide();
}

function mostrarRegistro() {
    console.log("teste botão hiden2");
    $("#register").show();
    $("#login").hide();
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log("botão submit funcionando");
    mostrarLoading();

    const email = document.getElementById('emailLogin').value.trim();
    const password = document.getElementById('passwordLogin').value;

    if (!email || !password) {
        M.toast({ html: 'Por favor, preencha todos os campos', classes: 'red' });
        return;
    }

    try {
        const response = await fetch(`${url}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro no login');
        }

        localStorage.setItem('token', data.token); // Guarda o token

        const decoded = jwt_decode(data.token);
        localStorage.setItem('userName', decoded.name); // salva o nome

        Swal.fire('Login realizado!', '', 'success').then(() => {
            window.location.href = '/';
            console.log("realiza direcionamento");
        });
    } catch (error) {
        Swal.fire('Erro', error.message, 'error');
    } finally {
        esconderLoading();
    }
});

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log("Botão de cadastro funcionando");
    mostrarLoading();

    const name = document.getElementById('nameRegister').value.trim();
    const email = document.getElementById('emailRegister').value.trim();
    const password = document.getElementById('passwordRegister').value;

    console.log(name, email, password);

    if (!name || !email || !password) {
        M.toast({ html: 'Por favor, preencha todos os campos', classes: 'red' });
        return;
    }

    try {
        const response = await fetch(`${url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar');
        }

        Swal.fire('Cadastro realizado com sucesso!', '', 'success').then(() => {
            // Após o cadastro, troca para a tela de login
            document.getElementById('register').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        });
    } catch (error) {
        Swal.fire('Erro', error.message, 'error');
    } finally {
        esconderLoading(); // Sempre esconde o loading ao final
    }
});

