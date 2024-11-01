<?php

require_once  '../../../api/path/api-path.php';
$url = API_PATH . 'pagamento/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $descricao = isset($_POST["descricao"]) && trim($_POST['descricao']) != '' ? $_POST['descricao'] : msgHttpCode(400, 'Descrição não pode estar vazio');
    
    $data = array(
        'descricao' => $descricao,
        'taxa' => 0
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
        msgHttpCode($httpcode, "Erro ao inserir Forma de Pagamento: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
