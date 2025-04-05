<?php

require_once  '../../../api/path/api-path.php';
  $url = API_PATH . 'loja/';

function msgHttpCode($httpcode, $msg){
  http_response_code($httpcode);
  echo $msg;
  exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nomeFantasia = isset($_POST["nomeFantasia"]) ? $_POST['nomeFantasia'] : msgHttpCode(400, 'Nome Fantasia não pode estar vazio');
  $cpfCnpj = isset($_POST["cpfCnpj"]) && (strlen(preg_replace('/\D/', '', $_POST["cpfCnpj"])) === 11 || strlen(preg_replace('/\D/', '', $_POST["cpfCnpj"])) === 14  ) ? $_POST["cpfCnpj"] : msgHttpCode(400, 'preencha o CPF/CNPJ corretamente');
  $ie = isset($_POST["ie"]) ? $_POST["ie"] : '';
  $endereco = isset($_POST["endereco"]) ? $_POST["endereco"] : msgHttpCode(400, 'Endereço não pode estar vazio');

  $data = array(
    'nomeFantasia' => $nomeFantasia,
    'cpfCnpj' => $cpfCnpj,
    'ie' => $ie,
    'endereco' => $endereco
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
    msgHttpCode($httpcode, "Erro ao inserir Loja: " . $response);
  }

}else{
  msgHttpCode(400, "Permissão Negada");
}
?>
