import { PermissaoSeedData } from '../domain/permissao.repository';

const MODULOS: { chave: string; nome: string }[] = [
  { chave: 'categoria', nome: 'Categoria' },
  { chave: 'cliente', nome: 'Cliente' },
  { chave: 'contagem-cliente', nome: 'Contagem de clientes' },
  { chave: 'contas-pagar', nome: 'Contas a pagar' },
  { chave: 'contas-receber', nome: 'Contas a receber' },
  { chave: 'estoque', nome: 'Estoque' },
  { chave: 'loja', nome: 'Loja' },
  { chave: 'pagamento', nome: 'Pagamento' },
  { chave: 'paginas', nome: 'Páginas' },
  { chave: 'produto', nome: 'Produto' },
  { chave: 'regra-fiscal', nome: 'Regra fiscal' },
  { chave: 'status-pagamento', nome: 'Status de pagamento' },
  { chave: 'venda', nome: 'Venda' },
  { chave: 'venda-item', nome: 'Item de venda' },
  { chave: 'venda-relatorio', nome: 'Relatório de vendas' },
];

const ACOES: { sufixo: string; descricao: string }[] = [
  { sufixo: 'criar', descricao: 'Criar' },
  { sufixo: 'listar', descricao: 'Listar/visualizar' },
  { sufixo: 'editar', descricao: 'Editar' },
  { sufixo: 'deletar', descricao: 'Excluir' },
];

export const PERMISSION_CATALOG: PermissaoSeedData[] = MODULOS.flatMap((modulo) =>
  ACOES.map((acao) => ({
    chave: `${modulo.chave}:${acao.sufixo}`,
    descricao: `${acao.descricao} - ${modulo.nome}`,
  })),
);
