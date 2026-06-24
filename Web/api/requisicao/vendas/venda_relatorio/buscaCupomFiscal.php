<?php
require_once  '../../../../api/path/api-path.php';

function msgHttpCode($httpcode, $msg) {
  http_response_code($httpcode);
  echo $msg;
  exit;
}

$id_venda = isset($_GET['id_venda']) && intval($_GET['id_venda']) > 0
  ? intval($_GET['id_venda'])
  : msgHttpCode(400, 'ID Venda precisa estar definido');

$url = API_PATH . 'venda-relatorio/cupom_fiscal/' . $id_venda;

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
  msgHttpCode($httpcode, "Erro ao Buscar Cupom Fiscal: " . $response);
}
?>
