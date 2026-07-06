<?php
require_once  '../../../../api/path/api-path.php';
$url = API_PATH . 'venda_relatorio/cupom_fiscal/';

$id_venda = isset($_GET['id_venda']) && floatval($_GET["id_venda"]) > 0 ? $_GET['id_venda'] : msgHttpCode(400, 'ID Venda precisa estar definida');

$data = array(
    'idVenda' => $id_venda
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
    msgHttpCode($httpcode, "Erro ao Buscar Cupom Fiscal: " . $response);
  }
?>