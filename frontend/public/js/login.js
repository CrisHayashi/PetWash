// Mostrar e esconder loading
function mostrarLoading() {
  $("#loading").removeClass("hide");
}

function esconderLoading() {
  $("#loading").addClass("hide");
}

// Alternância entre login e registro
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('register').style.display = 'none';
  document.getElementById('login').style.display = 'block';
  M.updateTextFields();
});

function mostrarLogin() {
  $("#login").show();
  $("#register").hide();
}

function mostrarRegistro() {
  $("#register").show();
  $("#login").hide();
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  mostrarLoading();

  const email = document.getElementById('emailLogin').value.trim();
  const password = document.getElementById('passwordLogin').value;

  if (!email || !password) {
    M.toast({ html: 'Preencha todos os campos', classes: 'red' });
    return;
  }

  try {
    const response = await fetch(`${URL_API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (!response.ok) throw new Error(data.message || 'Erro no login');

    localStorage.setItem('token', data.token);
    const decoded = jwt_decode(data.token);
    localStorage.setItem('userName', decoded.name);

    Swal.fire('Login realizado!', '', 'success').then(() => {
      window.location.href = '/';
    });
  } catch (error) {
    Swal.fire('Erro', error?.message || 'Erro inesperado', 'error');
  } finally {
    esconderLoading();
  }
});

// REGISTRO
document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  mostrarLoading();

  const name = document.getElementById('nameRegister').value.trim();
  const email = document.getElementById('emailRegister').value.trim();
  const password = document.getElementById('passwordRegister').value;

  if (!name || !email || !password) {
    M.toast({ html: 'Preencha todos os campos', classes: 'red' });
    return;
  }

  try {
    const response = await fetch(`${URL_API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    console.log('Cadastro response:', data);

    if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar');

    Swal.fire('Cadastro realizado com sucesso!', '', 'success').then(() => {
      mostrarLogin();
    });
  } catch (error) {
    Swal.fire('Erro', error?.message || 'Erro inesperado', 'error');
  } finally {
    esconderLoading();
  }
});