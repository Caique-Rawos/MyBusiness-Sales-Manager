<?php
    require_once  'api/path/api-path.php';

    $alias = isset($_GET['r']) ? $_GET['r'] : '';
    $url = API_PATH . 'paginas/' . $alias;

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($curl);

    if ($response !== false) {
        $data = json_decode($response);

        if ($data !== null && isset($data->arquivo)) {
            return strval($data->arquivo);
        }
    }

    return null;

    curl_close($curl);
?>