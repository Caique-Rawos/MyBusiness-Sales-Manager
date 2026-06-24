<?php
require_once  '../../../../api/path/api-path.php';

function msgHttpCode($httpcode, $msg) {
  http_response_code($httpcode);
  echo $msg;
  exit;
}

$dataInicio = isset($_GET['dataInicio']) ? $_GET['dataInicio'] : msgHttpCode(400, 'Data de Inicio precisa estar definida');
$dataFinal = isset($_GET['dataFinal']) ? $_GET['dataFinal'] : msgHttpCode(400, 'Data Final precisa estar definida');

$url = API_PATH . 'venda-relatorio/data?dataInicio=' . urlencode(date('Y-m-d', strtotime($dataInicio))) . '&dataFim=' . urlencode(date('Y-m-d', strtotime($dataFinal)));

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPGET, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode == 200) {
  $responseData = json_decode($response, true);
  if ($responseData !== null) {
      echo json_encode($responseData);
  }
} else {
  msgHttpCode($httpcode, "Erro ao Buscar Venda Relatorio Data: " . $response);
}
?>
