<?php

require_once  '../../../api/path/api-path.php';
  $url = API_PATH . 'cliente/';

function msgHttpCode($httpcode, $msg){
  http_response_code($httpcode);
  echo $msg;
  exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
  $nome = isset($_POST["nome"]) ? $_POST['nome'] : msgHttpCode(400, 'Nome não pode estar vazio');
  $cpfCnpj = isset($_POST["cpfCnpj"]) ? $_POST["cpfCnpj"] : msgHttpCode(400, 'CPF/CNPJ não pode estar vazio');
  $observacao = isset($_POST["observacao"]) ? $_POST["observacao"] : '';

  $data = array(
    'nome' => $nome,
    'cpfCnpj' => $cpfCnpj,
    'observacao' => $observacao
  );

  $json_data = json_encode($data);

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($json_data))
  );
  $response = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($httpcode == 201) {
    http_response_code(201);
    $responseData = json_decode($response, true);
    if ($responseData !== null) {
        echo json_encode($responseData);
    }
  } else {
    msgHttpCode($httpcode, "Erro ao inserir cliente: " . $response);
  }

}else{
  msgHttpCode(400, "Permissão Negada");
}
?>
