import { PermissaoSeedData } from '../domain/permissao.repository';

// `id` e a chave usada no CODIGO (PERMISSOES.LOJA.deletar) -- estavel, nunca muda.
// `chave`/`sufixo` sao os valores que viram string de verdade (no banco, no JWT).
// Renomear `chave` (ex: 'loja' -> 'lojas') ou `sufixo` (ex: 'deletar' -> 'remover')
// só muda esta lista -- nenhum controller que usa PERMISSOES.X.y precisa ser tocado.
const MODULOS = [
  { id: 'CATEGORIA', chave: 'categoria', nome: 'Categoria' },
  { id: 'CLIENTE', chave: 'cliente', nome: 'Cliente' },
  { id: 'CONTAGEM_CLIENTE', chave: 'contagem-cliente', nome: 'Contagem de clientes' },
  { id: 'CONTAS_PAGAR', chave: 'contas-pagar', nome: 'Contas a pagar' },
  { id: 'CONTAS_RECEBER', chave: 'contas-receber', nome: 'Contas a receber' },
  { id: 'ESTOQUE', chave: 'estoque', nome: 'Estoque' },
  { id: 'LOJA', chave: 'loja', nome: 'Loja' },
  { id: 'PAGAMENTO', chave: 'pagamento', nome: 'Pagamento' },
  { id: 'PAPEL', chave: 'papel', nome: 'Papel' },
  { id: 'PRODUTO', chave: 'produto', nome: 'Produto' },
  { id: 'REGRA_FISCAL', chave: 'regra-fiscal', nome: 'Regra fiscal' },
  { id: 'STATUS_PAGAMENTO', chave: 'status-pagamento', nome: 'Status de pagamento' },
  { id: 'USUARIO', chave: 'usuario', nome: 'Usuário' },
  { id: 'VENDA', chave: 'venda', nome: 'Venda' },
  { id: 'VENDA_ITEM', chave: 'venda-item', nome: 'Item de venda' },
  { id: 'VENDA_RELATORIO', chave: 'venda-relatorio', nome: 'Relatório de vendas' },
] as const;

const ACOES = [
  { id: 'criar', sufixo: 'criar', descricao: 'Criar' },
  { id: 'listar', sufixo: 'listar', descricao: 'Listar/visualizar' },
  { id: 'editar', sufixo: 'editar', descricao: 'Editar' },
  { id: 'deletar', sufixo: 'deletar', descricao: 'Excluir' },
] as const;

type ModuloId = (typeof MODULOS)[number]['id'];
type ModuloChave = (typeof MODULOS)[number]['chave'];
type AcaoId = (typeof ACOES)[number]['id'];
type AcaoSufixo = (typeof ACOES)[number]['sufixo'];

export type PermissaoChave = `${ModuloChave}:${AcaoSufixo}`;

function chaveDe(moduloChave: ModuloChave, acaoSufixo: AcaoSufixo): PermissaoChave {
  return `${moduloChave}:${acaoSufixo}`;
}

// Uso nos controllers: @RequirePermission(PERMISSOES.LOJA.criar)
export const PERMISSOES = Object.fromEntries(
  MODULOS.map((modulo) => [
    modulo.id,
    Object.fromEntries(ACOES.map((acao) => [acao.id, chaveDe(modulo.chave, acao.sufixo)])),
  ]),
) as Record<ModuloId, Record<AcaoId, PermissaoChave>>;

export const PERMISSION_CATALOG: PermissaoSeedData[] = MODULOS.flatMap((modulo) =>
  ACOES.map((acao) => ({
    chave: chaveDe(modulo.chave, acao.sufixo),
    descricao: `${acao.descricao} - ${modulo.nome}`,
  })),
);
