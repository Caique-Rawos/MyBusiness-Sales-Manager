<?php

require_once  '../../../api/path/api-path.php';
$url = API_PATH . 'regra_fiscal/';

function msgHttpCode($httpcode, $msg){
http_response_code($httpcode);
echo $msg;
exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $codigo = isset($_POST["codigo"]) ? $_POST['codigo'] : '';
    $descricao = isset($_POST["descricao"]) && trim($_POST['descricao']) != '' ? $_POST['descricao'] : msgHttpCode(400, 'Descrição não pode estar vazio');
    $ncm = isset($_POST["ncm"]) && trim($_POST['ncm']) != '' && strlen(trim($_POST['ncm'])) === 10 ? $_POST['ncm'] : msgHttpCode(400, 'NCM precisa ter 8 digitos');
    $icms = isset($_POST["icms"]) && floatval($_POST["icms"]) > 0 ? $_POST["icms"] : msgHttpCode(400, 'ICMS precisa ser maior que 0');
    $pis = isset($_POST["pis"]) && floatval($_POST["pis"]) > 0 ? $_POST["pis"] : msgHttpCode(400, 'PIS precisa ser maior que 0');
    $cofins = isset($_POST["cofins"]) && floatval($_POST["cofins"]) > 0 ? $_POST["cofins"] : msgHttpCode(400, 'COFINS precisa ser maior que 0');
    $ipi = isset($_POST["ipi"]) ? $_POST["ipi"] : msgHttpCode(400, 'IPI não pode estar vazio');
    
    $data = array(
        'descricao' => $descricao,
        'ncm' => $ncm,
        'icms' => $icms,
        'pis' => $pis,
        'cofins' => $cofins,
        'ipi' => $ipi,
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
        msgHttpCode($httpcode, "Erro ao inserir Regra Fiscal: " . $response);
      }
    
    }else{
      msgHttpCode(400, "Permissão Negada");
    }
?>
