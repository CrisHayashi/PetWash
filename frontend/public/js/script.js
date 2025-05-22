
// function alertaPersonalizado({ 
//   titulo = 'Atenção!', 
//   texto = '', 
//   tipo = 'info',      // 'success', 'error', 'warning', 'info', 'question'
//   tempo = 3000,      // tempo automático pra fechar (ms), 0 para não fechar
//   mostrarConfirmar = true 
// } = {}) {
//   Swal.fire({
//     title: titulo,
//     text: texto,
//     icon: tipo,
//     timer: tempo,
//     timerProgressBar: tempo > 0,
//     showConfirmButton: mostrarConfirmar,
//     confirmButtonText: 'Ok',
//     allowOutsideClick: false,
//     allowEscapeKey: false,
//     didOpen: (toast) => {
//       if (tempo > 0) {
//         const b = Swal.getTimerProgressBar()
//         b.style.background = '#3085d6'
//       }
//     }
//   });
// }

// const url = process.env.URL_API || 'http://localhost:3000'; // URL da API

// const formIds = {
//     petForm: 'petId',
//     tutorForm: 'tutorId',
//     produtoForm: 'prodId',
//     servicoForm: 'servId',
//     pedidoForm: 'pedidoId'
// };

// function esconderElementos(...selectors) {
//     selectors.forEach(sel => $(sel).hide());
// }

// function mostrarElemento(selector) {
//     $(selector).show();
// }

// function menuEdit(id, form, endpoint) {
//     esconderElementos(
//         "#table_pet", "#table_tutor", "#table_produto", "#table_servico", "#table_pedido",
//         "#btn_novoPet", "#btn_novoTutor", "#btn_novoProduto", "#btn_novoServico", "#btn_novoPedido"
//     );
//     mostrarElemento(`#${form}`);

//     fetch(URL_API + endpoint + id)
//         .then(res => res.json())
//         .then(data => {
//             listaSuspensa(`tutors`, `tutorId`).then(() => {
//                 $(`#tutorId`).val(data.tutorId).trigger("change");
//             });

//             editar = true;
//             const ids = {
//                 petForm: () => petId = id,
//                 tutorForm: () => tutorId = id,
//                 produtoForm: () => prodId = id,
//                 servicoForm: () => servId = id,
//                 pedidoForm: () => pedidoId = id
//             };
//             if (ids[form]) ids[form]();

//             for (let campoName in data) {
//                 ativarClassesDeInputPreencher(`[name="${campoName}"]`, data[campoName]);
//             }
//         });
// }

// let petId, tutorId, prodId, servId, pedidoId; // variáveis para armazenar os IDs dos objetos
// let editar; // variável para determinar se o objeto está sendo editado
// let tab; // variável para armazenar a aba atual

// const route = window.location.pathname.split("/")[1]; // obtém a rota atual

// function telaDeCarregamento(tempo = 800) {
//     const loader = document.getElementById("loader"); // supondo que você tenha um div com id="loader"
//     if (loader) {
//         loader.style.display = "block";
//         setTimeout(() => {
//             loader.style.display = "none";
//         }, tempo);
//     }
// }
// $(window).on('load', function () {
//     telaDeCarregamento(800);
    
//     const routes = {
//         index: () => tab = 0,
//         pets: () => (tab = 1, telaInicial()),
//         tutors: () => (tab = 2, telaInicial()),
//         products: () => (tab = 3, telaInicial()),
//         services: () => (tab = 4, telaInicial()),
//         orders: () => (tab = 5, telaInicial())
//     }

//     if (routes[route]) (routes[route])();
    
// });

// // botões
// const botoes = [
//     { novo: "Pet", salvar: "pet", form: "petForm", endpoint: "pets/", idVar: () => petId, setId: id => petId = id },
//     { novo: "Tutor", salvar: "tutor", form: "tutorForm", endpoint: "tutors/", idVar: () => tutorId, setId: id => tutorId = id },
//     { novo: "Produto", salvar: "produto", form: "produtoForm", endpoint: "products/", idVar: () => prodId, setId: id => prodId = id },
//     { novo: "Servico", salvar: "servico", form: "servicoForm", endpoint: "services/", idVar: () => servId, setId: id => servId = id },
//     { novo: "Pedido", salvar: "pedido", form: "pedidoForm", endpoint: "orders/", idVar: () => pedidoId, setId: id => pedidoId = id }
// ];

// botoes.forEach(b => {
//     $(`#btn_novo${b.novo}`).on('click', () => menuAdd (b.form));
     
//     $(`#btn_salvar${b.novo}`).on('click', () => {
//         if (editar) { 
//             Swal.fire({
//                 title: 'Deseja salvar as alterações?',
//                 icon: 'question',
//                 showCancelButton: true,
//                 confirmButtonText: 'Salvar'
//             }).then(result => {
//                 if (result.isConfirmed) {
//                     atualizarPorId(b.idVar(), b.endpoint, b.form);
//                     telaInicial();
//                 }
//             });
//         } else { // caso seja um novo botao, confirma se todos os campos estão preenchidos, caso sim, salva
//             verificarCamposNovo(b.form, b.endpoint);
//         }
//     });

//     $(`#btn_voltar${b.novo}`).on('click', () => { 
//         Swal.fire({
//             title: 'Deseja voltar?',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Sim'
//         }).then(result => {
//             if (result.isConfirmed) telaInicial();
//         });
//     });
// });

// function pegarForm(formulario) {
//     const form = document.getElementById(formulario);
//     const objForm = new FormData(form);
//     let obj = {};

//     for (const [key, value] of objForm) {
//         obj[key] = key === "tutorId" ? Number(value) : value;
//         if (obj[key] === "" && editar) delete obj[key];
//     }
//     return obj;
// }

// function verificarCamposNovo(formulario, endpoint) {
//     const form = document.getElementById(formulario);
//     const objForm = new FormData(form);
//     const obrigatorio = form.querySelectorAll('[required]');

//     for (let verif of obrigatorio) {
//         if (!objForm.get(verif.name)) {
//             return Swal.fire('Campo obrigatório', `O campo ${verif.dataset.label} é obrigatório!`, 'warning');
//         }
//     }

//     Swal.fire({
//         title: 'Deseja salvar?',
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonText: 'Salvar'
//     }).then(result => {
//         if (result.isConfirmed) {
//             gravar(endpoint, formulario);
//             telaInicial();
//         }
//     });
// }

// async function listaSuspensa(endpoint, idName) {
//     const data = await carregar(`${endpoint}/`);
//     let lista = `<option disabled selected>Selecione um item</option>`;
//     data.forEach(dat => lista += `<option value="${dat.id}">${dat.name}</option>`);
//     $(`#${idName}`).html(lista);
// }

// function formParam(formulario) {
//     const param = formulario.replace("Form", "");
//     const paramUpper = param.charAt(0).toUpperCase() + param.slice(1);
//     return [param, paramUpper];
// }

// function removerAttrRequired(formulario) {
//     const form = document.getElementById(formulario);
//     form.reset();
//     form.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
// }

// function ativarClassesDeInputPreencher(element, value) {
//     $(element).val(value).addClass('valid').siblings('label').addClass('active');
// }

// function menuAdd(formulario) {
//     const form = document.getElementById(formulario);
//     form.reset();
//     form.querySelectorAll('input').forEach(input => input.setAttribute('required', ''));
//     editar = false;
//     $(`#${formulario}`).show();

//     const [param, paramUpper] = formParam(formulario);
//     $(`#table_${param}, #btn_novo${paramUpper}`).hide();
//     listaSuspensa(`tutors`, `tutorId`);

//     // Máscara com IMask
//     if (formulario === 'tutorForm') {
//         const telInput = document.getElementById('telefone');
//         if (telInput) IMask(telInput, { mask: '(00) 00000-0000' });
//     }
// }

// async function carregar(endpoint) {
//     const res = await fetch(url + endpoint);
//     const data = await res.json();
//     return data.sort((a, b) => a.name.localeCompare(b.name));
// }

// async function gravar(endpoint, form) {
//     try {
//         const json = JSON.stringify(pegarForm(form));
//         const res = await fetch(url + endpoint, {
//             method: "POST",
//             headers: { "content-type": "application/json" },
//             body: json
//         });

//         if (!res.ok) throw new Error(`Erro ao gravar: ${res.statusText}`);

//         alertaPersonalizado({
//             titulo: 'Sucesso!',
//             texto: 'Cadastro realizado com sucesso.',
//             tipo: 'success',
//             tempo: 2500,
//             mostrarConfirmar: false
//         });

//         telaInicial();

//     } catch (error) {
//         alertaPersonalizado({
//             titulo: 'Erro!',
//             texto: error.message || 'Não foi possível salvar o cadastro.',
//             tipo: 'error',
//             tempo: 0,
//             mostrarConfirmar: true
//         });
//     }
// }

// async function atualizarPorIdParcial(id, endpoint, form) {
//     const json = JSON.stringify(pegarForm(form));
//     const res = await fetch(url + endpoint + id, {
//         method: 'PATCH',
//         headers: { "content-type": "application/json" },
//         body: json
//     });

//     if (!res.ok) {
//         throw new Error("Erro ao atualizar.");
//     }
//     return await res.json();
// }

// function deletarPorId(endpoint, id) {
//         Swal.fire({
//         title: 'Deseja deletar?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Sim',
//         cancelButtonText: 'Cancelar'
//     }).then(result => {
//         if (!result.isConfirmed) return;

//         fetch(url + endpoint + id, { method: 'DELETE' })
//             .then(res => res.json())
//             .then(data => {
//                 if (tab === 2 && data.message) {
//                     Swal.fire('Aviso', data.message, 'info');
//                     return;
//                 }

//                 const executar = {
//                     1: () => listaPet(),
//                     2: () => listaDinamica(`tutors/`, `tutor_list`, listaTutor),
//                     3: () => listaDinamica(`products/`, `produto_list`, listaProduto),
//                     4: () => listaDinamica(`services/`, `servico_list`, listaServico),
//                     5: () => listaDinamica(`orders/`, `pedido_list`, listaPedido)
//                 };
//                 if (executar[tab]) executar[tab]();
//             })
//             .catch(error => console.error("Erro ao excluir:", error));
//     });
// }

// function telaInicial() {
//     const removerRequired = ["petForm", "tutorForm", "produtoForm", "servicoForm", "pedidoForm"];
//     removerRequired.forEach(removerAttrRequired);

//     $("form").hide();
//     $(`#btn_novoPet, #btn_novoTutor, #btn_novoProduto, #btn_novoServico, #btn_novoPedido`).show();

//     const tabelas = ["#table_pet", "#table_tutor", "#table_produto", "#table_servico", "#table_pedido"];
//     tabelas.forEach((t, i) => i + 1 === tab ? $(t).show() : $(t).hide());

//     const funcoes = {
//         1: listaPet,
//         2: () => listaDinamica(`tutors/`, `tutor_list`, listaTutor),
//         3: () => listaDinamica(`products/`, `produto_list`, listaProduto),
//         4: () => listaDinamica(`services/`, `servico_list`, listaServico),
//         5: () => listaDinamica(`orders/`, `pedido_list`, listaPedido)
//     };
//     if (funcoes[tab]) funcoes[tab]();
// }
