import { Produto } from './produto';
import { CreateProdutoDto } from '../application/dto/create-produto.dto';
import { UpdateProdutoDto } from '../application/dto/update-produto.dto';

export const PRODUTO_REPOSITORY = 'PRODUTO_REPOSITORY';

export interface ProdutoRepository {
  create(data: CreateProdutoDto): Promise<Produto>;
  findAll(): Promise<Produto[]>;
  findById(id: number): Promise<Produto | null>;
  update(id: number, data: UpdateProdutoDto): Promise<Produto>;
  delete(id: number): Promise<void>;
  existsByRegraFiscalId(idRegraFiscal: number): Promise<boolean>;
  existsByCategoriaId(idCategoria: number): Promise<boolean>;
  updateEstoque(id: number, novoEstoque: number): Promise<void>;
}