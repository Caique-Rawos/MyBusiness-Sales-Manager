<?php

require_once  '../../../api/path/api-path.php';
$url = API_PATH . 'venda/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $valorTotal = isset($_POST["valorTotal"]) ? $_POST["valorTotal"] : msgHttpCode(400, 'Valor Total precisa estar definido');
    $dataVenda = isset($_POST["dataVenda"]) && trim($_POST['dataVenda']) != '' ? $_POST["dataVenda"] : msgHttpCode(400, 'Data da Venda não pode estar vazia');
    $id_cliente = isset($_POST["selecionarCliente"]) ? intval($_POST["selecionarCliente"]) : msgHttpCode(400, 'Cliente não pode estar vazia');
    
    $data = array(
        'totalVenda' => $valorTotal,
        'dataVenda' => $dataVenda,
        'idCliente' => $id_cliente,
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
        msgHttpCode($httpcode, "Erro ao inserir Venda: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
