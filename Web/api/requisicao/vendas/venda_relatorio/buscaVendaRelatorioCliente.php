<?php
require_once  '../../../../api/path/api-path.php';
$url = API_PATH . 'venda_relatorio/cliente/';

$dataInicio = isset($_GET['dataInicio']) ? $_GET['dataInicio'] : msgHttpCode(400, 'Data de Inicio precisa estar definida');
$dataFinal = isset($_GET['dataFinal']) ? $_GET['dataFinal'] : msgHttpCode(400, 'Data Final precisa estar definida');

$data = array(
    'dataInicio' => date('Y-m-d', strtotime($dataInicio)),
    'dataFim' => date('Y-m-d', strtotime($dataFinal)),
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
    msgHttpCode($httpcode, "Erro ao Buscar Venda Relatorio: " . $response);
  }
?>