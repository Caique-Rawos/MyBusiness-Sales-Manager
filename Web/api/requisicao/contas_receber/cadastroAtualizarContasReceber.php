<?php

require_once  '../../../api/path/api-path.php';
$url = API_PATH . 'contas_receber/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $idVenda = isset($_POST["idVenda"]) && floatval($_POST["idVenda"]) > 0 ? $_POST['idVenda'] : null;
    $descricao = isset($_POST["descricao"]) && trim($_POST['descricao']) != '' ? $_POST['descricao'] : msgHttpCode(400, 'Descrição não pode estar vazio');
    $valorTotal = isset($_POST["valorTotal"]) && floatval($_POST["valorTotal"]) > 0 ? $_POST["valorTotal"] : (isset($_POST["ignoraZero"]) &&  $_POST["ignoraZero"] == true ? $_POST["valorTotal"] : msgHttpCode(400, 'Valor Total precisa ser maior que 0'));
    $valorPago = isset($_POST["valorPago"]) ? $_POST["valorPago"] : msgHttpCode(400, 'Valor Pago não pode estar vazio');
    $dataVencimento = isset($_POST["dataVencimento"]) && trim($_POST['dataVencimento']) != '' ? $_POST["dataVencimento"] : msgHttpCode(400, 'Data Vencimento não pode estar vazia');
    $id_forma_pagamento = isset($_POST["id_forma_pagamento"]) ? intval($_POST["id_forma_pagamento"]) : msgHttpCode(400, 'Forma Pagamento não pode estar vazia');
    $id_status_pagamento = isset($_POST["id_status_pagamento"]) ? intval($_POST["id_status_pagamento"]) : msgHttpCode(400, 'Status Pagamento não pode estar vazia');
    
    $data = array(
        'descricao' => $descricao,
        'valorTotal' => $valorTotal,
        'valorPago' => $valorPago,
        'dataVencimento' => $dataVencimento,
        'idPagamento' => $id_forma_pagamento,
        'idStatusPagamento' => $id_status_pagamento,
        'idVenda' => $idVenda
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
        msgHttpCode($httpcode, "Erro ao inserir Conta a Receber: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
