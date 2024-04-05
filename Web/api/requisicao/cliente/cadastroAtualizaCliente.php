<?php
function msgErro($msg){
  http_response_code(400);
  echo $msg;
  exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $nome = isset($_POST["nome"]) ? $_POST['nome'] : msgErro('Nome não pode estar vazio');
    $cpfCnpj = isset($_POST["cpfCnpj"]) ? $_POST["cpfCnpj"] : msgErro('CPF/CNPJ não pode estar vazio');
    $observacao = isset($_POST["observacao"]) ? $_POST["observacao"] : '';
}else{
  msgErro('Você não tem permissão para isso!');
}
?>
