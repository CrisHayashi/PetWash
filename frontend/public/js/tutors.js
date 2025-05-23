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