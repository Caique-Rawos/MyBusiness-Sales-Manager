<!DOCTYPE html>
<html lang="pt-BR">
<head>
		<meta charset="UTF-8">
		<style>
			.is-invalid {
      border-color: #dc3545 !important;
    }
		</style>

		<script>
			function mensagemErro(msg){
				if(msg == ''){
					msg = 'Erro Desconhecido';
				}
				Swal.fire({
					title: 'Erro!',
					text: msg,
					icon: 'error',
					confirmButtonText: 'Ok'
				});
			}
		</script>
</head>
<body>
	<div class="container">
    <h1 class="text-center mt-3 page-title">Cadastro de Cliente</h1>
    <form class="needs-validation mt-5" novalidate>
      <div class="row">
        <div class="col-sm-12 col-md-2">
          <div class="mb-3 form-group">
            <label for="codigo" class="form-label">Código</label>
            <input type="text" class="form-control" id="codigo" name="codigo" readonly>
          </div>
        </div>
        <div class="col-sm-12 col-md-5">
          <div class="mb-3 form-group">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" placeholder="Nome do cliente" required>
            <div class="invalid-feedback">
              Por favor, insira o nome do cliente.
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-5">
          <div class="mb-3 form-group">
            <label for="cpfCnpj" class="form-label">CPF/CNPJ</label>
            <input type="text" class="form-control" id="cpfCnpj" name="cpfCnpj" placeholder="CPF ou CNPJ do cliente" required>
            <div class="invalid-feedback">
              Por favor, insira o CPF ou CNPJ do cliente.
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3 form-group">
            <label for="observacao" class="form-label">Observação</label>
            <textarea class="form-control" id="observacao" name="observacao" rows="3" placeholder="Digite alguma observação sobre o cliente"></textarea>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Cadastrar</button>
    </form>
  </div>

	<script>
		(function () {
			'use strict'

			var forms = document.querySelectorAll('.needs-validation')

			Array.prototype.slice.call(forms)
				.forEach(function (form) {
					form.addEventListener('submit', function (event) {
						var cpfCnpj = $('#cpfCnpj').val().replace(/\D/g, '');
						var isCpfCnpjValid = (cpfCnpj.length == 11 || cpfCnpj.length == 14);
						if (!form.checkValidity() || !isCpfCnpjValid) {
							event.preventDefault();
							event.stopPropagation();
						}else{
							event.preventDefault();
							var formData = $(form).serialize();

							$.ajax({
								type: 'POST',
								url: './api/requisicao/cliente/cadastroAtualizaCliente.php',
								data: formData,
								success: function (data) {
									Swal.fire({
										position: "top-end",
										icon: "success",
										title: "Salvo Com Sucesso",
										showConfirmButton: false,
										timer: 1500
									});
								},
								error: function (jqXHR, textStatus, errorThrown) {
									mensagemErro(jqXHR.responseText);
								}
							});
						}
						form.classList.add('was-validated');
					}, false)
				})
		})()

		$(document).ready(function() {
				$('#cpfCnpj').inputmask({
        mask: ['999.999.999-99', '99.999.999/9999-99'],
        keepStatic: true
      });

			$('#cpfCnpj').on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        if (value.length === 11 || value.length === 14) {
          $(this).removeClass('is-invalid');
          $(this).addClass('is-valid');
        } else {
          $(this).removeClass('is-valid');
          $(this).addClass('is-invalid');
        }
      });
    });
	</script>
</body>
</html>