<?php

require_once '../../../api/path/api-path.php';

$idCracha = filter_input(INPUT_GET, 'idCracha', FILTER_VALIDATE_INT);
if ($idCracha === false || $idCracha === null || $idCracha < 1) {
    http_response_code(400);
    echo json_encode('Funcionário inválido.');
    exit;
}

$url = API_PATH . 'controle-ponto/?idCracha=' . urlencode((string) $idCracha);
$curl = curl_init($url);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPGET, true);

$response = curl_exec($curl);
$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

if ($response === false) {
    http_response_code(502);
    echo json_encode('Erro na requisição: ' . curl_error($curl));
} else {
    if ($statusCode >= 400) {
        http_response_code($statusCode);
    }
    echo json_encode($response);
}

curl_close($curl);
?>
