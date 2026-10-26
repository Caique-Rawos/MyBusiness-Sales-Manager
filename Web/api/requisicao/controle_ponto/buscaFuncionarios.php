<?php

require_once '../../../api/path/api-path.php';
$url = API_PATH . 'cracha-rfid/';

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
