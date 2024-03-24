class Requisicao {
  get(url, callback) {
    $.get(url, function (data) {
      callback(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error(
        "Houve um problema com a sua requisição:",
        textStatus,
        errorThrown
      );
    });
  }
}

class Parameter {
  getValue(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  incluirHTML(nomeArquivo) {
    fetch(nomeArquivo)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("Body").innerHTML = html;
      })
      .catch((error) => {
        console.error("Houve um problema ao incluir o arquivo HTML:", error);
      });
  }
}
