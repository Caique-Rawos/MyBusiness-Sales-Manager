<?php

require_once  '../../../../api/path/api-path.php';
$url = API_PATH . 'venda_item/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $id_venda = isset($_POST["id_venda"]) ? $_POST["id_venda"] : msgHttpCode(400, 'Codigo da Venda precisa estar definido');
    $valor_venda = isset($_POST["valor_venda"]) && floatval($_POST["valor_venda"]) > 0 ? $_POST["valor_venda"] : msgHttpCode(400, 'Valor de Venda precisa ser maior que 0');
    $valor_desconto = isset($_POST["valor_desconto"]) ? $_POST["valor_desconto"] : msgHttpCode(400, 'Valor de Desconto não pode estar vazio');
    $quantidade = isset($_POST["quantidade"]) ? $_POST["quantidade"] : msgHttpCode(400, 'quantidade não pode estar vazia');
    $subTotal = isset($_POST["subTotal"]) && floatval($_POST["subTotal"]) > 0 ? $_POST["subTotal"] : msgHttpCode(400, 'Sub Total precisa ser maior que 0');
    $id_produto = isset($_POST["selecionarProduto"]) ? intval($_POST["selecionarProduto"]) : msgHttpCode(400, 'Produto não pode estar vazio');

    if($valor_venda < $valor_desconto){
      msgHttpCode(400, 'Valor de Venda precisa ser maior ou igual ao Valor do Desconto');
    }
    
    $data = array(
        'precoUnitario' => $valor_venda,
        'desconto' => $valor_desconto,
        'quantidade' => $quantidade,
        'subTotal' => $subTotal,
        'idVenda' => $id_venda,
        'idProduto' => $id_produto,
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
        msgHttpCode($httpcode, "Erro ao inserir Venda Item: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
