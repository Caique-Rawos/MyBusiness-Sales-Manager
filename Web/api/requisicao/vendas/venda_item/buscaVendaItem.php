<?php
require_once  '../../../../api/path/api-path.php';
$url = API_PATH . 'venda_item/venda?id_venda=' . $_GET['id_venda'];

$curl = curl_init($url);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPGET, true);

$response = curl_exec($curl);

if ($response === false) {
    $error = curl_error($curl);
    echo "Erro na requisição: $error";
} else {
  echo json_encode($response);
}

curl_close($curl);
?>