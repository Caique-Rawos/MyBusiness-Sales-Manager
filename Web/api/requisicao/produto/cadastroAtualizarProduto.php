<?php

require_once  '../../../api/path/api-path.php';
$url = API_PATH . 'produto/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $descricao = isset($_POST["descricao"]) && trim($_POST['descricao']) != '' ? $_POST['descricao'] : msgHttpCode(400, 'Descrição não pode estar vazio');
    $codBarra = isset($_POST["codBarra"]) && trim($_POST['codBarra']) != '' ? $_POST['codBarra'] : msgHttpCode(400, 'codigo de Barra não pode estar vazio');
    $precoVenda = isset($_POST["precoVenda"]) && floatval($_POST["precoVenda"]) > 0 ? $_POST["precoVenda"] : msgHttpCode(400, 'Preço de Venda precisa ser maior que 0');
    $precoCusto = isset($_POST["precoCusto"]) ? $_POST["precoCusto"] : msgHttpCode(400, 'Custo não pode estar vazio');
    $estoque = isset($_POST["estoque"]) && floatval($_POST["estoque"]) > 0 ? $_POST["estoque"] : msgHttpCode(400, 'Estoque precisa ser maior que 0');
    $unidade = isset($_POST["unidade"]) ? intval($_POST["unidade"]) : msgHttpCode(400, 'Unidade não pode estar vazia');
    $idCategoria = isset($_POST["idCategoria"]) ? intval($_POST["idCategoria"]) : msgHttpCode(400, 'Categoria não pode estar vazia');
    $idRegraFiscal = isset($_POST["idRegraFiscal"]) ? intval($_POST["idRegraFiscal"]) : msgHttpCode(400, 'Regra Fiscal não pode estar vazia');
    
    $data = array(
        'descricao' => $descricao,
        'codigoDeBarra' => $codBarra,
        'valorCusto' => $precoCusto,
        'valorVenda' => $precoVenda,
        'estoque' => $estoque,
        'unidade' => $unidade,
        'idCategoria' => $idCategoria,
        'idRegraFiscal' => $idRegraFiscal
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
        msgHttpCode($httpcode, "Erro ao inserir Produto: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
