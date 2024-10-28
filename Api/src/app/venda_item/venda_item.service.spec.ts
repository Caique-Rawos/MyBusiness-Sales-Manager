import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemService } from './venda_item.service';
import { VendaItemEntity } from './entity/venda_item.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendaService } from '../venda/venda.service';
import { VendaEntity } from '../venda/entity/venda.entity';
import { ContasReceberService } from '../contas_receber/contas_receber.service';
import { ContasReceberEntity } from '../contas_receber/entity/contas_receber.entity';
import { ProdutoService } from '../produto/produto.service';
import { ProdutoEntity } from '../produto/entity/produtos.entity';

describe('VendaItemService', () => {
  let service: VendaItemService;
  let vendaService: VendaService;
  let produtoService: ProdutoService;
  let repository: Repository<VendaItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaItemService,
        VendaService,
        ContasReceberService,
        ProdutoService,
        {
          provide: getRepositoryToken(VendaItemEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(VendaEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ContasReceberEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ProdutoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VendaItemService>(VendaItemService);
    vendaService = module.get<VendaService>(VendaService);
    produtoService = module.get<ProdutoService>(ProdutoService);
    repository = module.get<Repository<VendaItemEntity>>(
      getRepositoryToken(VendaItemEntity),
    );
  });

  it('should create a venda item entity', async () => {
    const vendaItemData: VendaItemEntity = {
      id: 1,
      precoUnitario: 10.99,
      desconto: 1.5,
      quantidade: 3,
      subTotal: 29.97,
      idVenda: 1,
      venda: {
        id: 1,
        totalVenda: 123,
        dataVenda: new Date(),
        idCliente: 1,
        cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
      },
      idProduto: 1,
      produto: {
        id: 1,
        descricao: 'Descrição do Produto',
        codigoDeBarra: '1234567890123',
        valorCusto: 50.0,
        valorVenda: 80.0,
        estoque: 100,
        unidade: 'UN',
        image: 'caminho/para/imagem.jpg',
        idCategoria: 1,
        categoria: { id: 1, descricao: 'produto' },
      },
    };

    jest.spyOn(repository, 'create').mockReturnValue(vendaItemData);
    jest.spyOn(repository, 'save').mockResolvedValue(vendaItemData);

    const result = await service.create(vendaItemData);

    expect(result).toEqual(vendaItemData);
    expect(repository.create).toHaveBeenCalledWith(vendaItemData);
    expect(repository.save).toHaveBeenCalledWith(vendaItemData);
  });

  it('should return a list of venda items', async () => {
    const vendaItems: VendaItemEntity[] = [
      {
        id: 1,
        precoUnitario: 10.99,
        desconto: 1.5,
        quantidade: 3,
        subTotal: 29.97,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
      {
        id: 2,
        precoUnitario: 12.99,
        desconto: 1.99,
        quantidade: 3,
        subTotal: 33.33,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 33.33,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(vendaItems);

    const result = await service.findAll();

    expect(result).toEqual(vendaItems);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return a list of venda items by venda id', async () => {
    const idVenda = 1;
    const vendaItems: VendaItemEntity[] = [
      {
        id: 1,
        precoUnitario: 10.99,
        desconto: 1.5,
        quantidade: 3,
        subTotal: 29.97,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
      {
        id: 2,
        precoUnitario: 12.99,
        desconto: 1.99,
        quantidade: 3,
        subTotal: 33.33,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 33.33,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(vendaItems);

    const result = await service.findByIdVenda(idVenda);

    expect(result).toEqual(vendaItems);
    expect(repository.find).toHaveBeenCalledWith({
      where: { venda: { id: idVenda } },
      relations: ['produto', 'produto.categoria', 'venda', 'venda.cliente'],
      order: { id: 'DESC' },
    });
  });

  it('should calculate total subtotals and update total venda', async () => {
    const idVenda = 1;
    const vendaItems: VendaItemEntity[] = [
      {
        id: 1,
        precoUnitario: 10.99,
        desconto: 1.5,
        quantidade: 3,
        subTotal: 29.97,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 123,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
      {
        id: 2,
        precoUnitario: 12.99,
        desconto: 1.99,
        quantidade: 3,
        subTotal: 33,
        idVenda: 1,
        venda: {
          id: 1,
          totalVenda: 33.33,
          dataVenda: new Date(),
          idCliente: 1,
          cliente: { id: 1, nome: 'teste', cpfCnpj: '3213213211' },
        },
        idProduto: 1,
        produto: {
          id: 1,
          descricao: 'Descrição do Produto',
          codigoDeBarra: '1234567890123',
          valorCusto: 50.0,
          valorVenda: 80.0,
          estoque: 100,
          unidade: 'UN',
          image: 'caminho/para/imagem.jpg',
          idCategoria: 1,
          categoria: { id: 1, descricao: 'produto' },
        },
      },
    ];

    jest.spyOn(service, 'findByIdVenda').mockResolvedValue(vendaItems);
    jest.spyOn(vendaService, 'atualizaTotal').mockResolvedValue();

    await service.novoTotalVenda(idVenda);

    expect(service.findByIdVenda).toHaveBeenCalledWith(idVenda);
    expect(vendaService.atualizaTotal).toHaveBeenCalled();
  });

  describe('atualizaEstoqueProduto', () => {
    it('should call atualizaEstoque with correct parameters', async () => {
      const idProduto = 1;
      const quantidade = 5;

      const atualizaEstoqueSpy = jest
        .spyOn(produtoService, 'atualizaEstoque')
        .mockResolvedValue(undefined);

      await service.atualizaEstoqueProduto(idProduto, quantidade);

      expect(atualizaEstoqueSpy).toHaveBeenCalledWith(idProduto, quantidade);
    });
  });
});
