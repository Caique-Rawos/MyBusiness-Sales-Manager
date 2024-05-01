document
  .getElementById("paymentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Obter os dados do formulário
    var formData = new FormData(this);

    // Fazer a requisição para o script PHP
    fetch("./api/requisicao/contas_pagar/cadastroAtualizaContasPagar.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("result").innerHTML = data;
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  });
