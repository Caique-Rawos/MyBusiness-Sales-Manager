<?php
// Configuração do banco de dados
$host = 'localhost';
$dbname = 'pagamentos';
$username = 'root';
password = ' ';

// Conectar ao banco de dados com tratamento de exceções
try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro ao conectar ao banco de dados: " . $e->getMessage());
}

// Verificar se os campos obrigatórios estão definidos
if (isset($_POST['descricao'], $_POST['valorTotal'], $_POST['dataVencimento'], $_POST['id_status_pagamento'], $_POST['id_forma_pagamento'])) {
    $descricao = $_POST['descricao'];
    $valorTotal = floatval($_POST['valorTotal']);
    $dataVencimento = $_POST['dataVencimento'];
    $id_status_pagamento = intval($_POST['id_status_pagamento']);
    $id_forma_pagamento = intval($_POST['id_forma_pagamento']);

    try {
        // Preparar a consulta SQL
        $stmt = $pdo->prepare("INSERT INTO pagamentos (descricao, valorTotal, dataVencimento, id_status_pagamento, id_forma_pagamento) 
                               VALUES (?, ?, ?, ?, ?)");

        // Executar a consulta com os parâmetros recebidos
        $stmt->execute([$descricao, $valorTotal, $dataVencimento, $id_status_pagamento, $id_forma_pagamento]);

        // Exibir mensagem de sucesso
        echo "Pagamento registrado com sucesso!";
    } catch (PDOException $e) {
        echo "Erro ao inserir dados no banco de dados: " . $e->getMessage();
    }
} else {
    echo "Por favor, preencha todos os campos obrigatórios.";
}
?>
