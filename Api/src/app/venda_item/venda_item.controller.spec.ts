import { Test, TestingModule } from '@nestjs/testing';
import { VendaItemController } from './venda_item.controller';
import { VendaItemService } from './venda_item.service';
import { VendaItemEntity } from './entity/venda_item.entity';
import { VendaItemModule } from './venda_item.module';

describe('VendaItemController', () => {
  let controller: VendaItemController;
  let service: VendaItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaItemController],
      providers: [
        {
          provide: VendaItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByIdVenda: jest.fn(),
            NovoTotalVenda: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaItemController>(VendaItemController);
    service = module.get<VendaItemService>(VendaItemService);
  });

  afterAll(async () => {
    try {
      await Test.createTestingModule({
        imports: [VendaItemModule],
        controllers: [VendaItemController],
        providers: [
          {
            provide: VendaItemService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
              findByIdVenda: jest.fn(),
              NovoTotalVenda: jest.fn(),
            },
          },
        ],
      }).compile();
    } catch (error) {
      /* EMPTY */
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a venda item', async () => {
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

    jest.spyOn(service, 'create').mockResolvedValue(vendaItemData);
    jest
      .spyOn(service, 'NovoTotalVenda')
      .mockResolvedValue(vendaItemData.idVenda);

    const result = await controller.create(vendaItemData);

    expect(result).toBe(vendaItemData);
    expect(service.create).toHaveBeenCalledWith(vendaItemData);
    expect(service.NovoTotalVenda).toHaveBeenCalledWith(vendaItemData.idVenda);
  });

  it('should find all venda items', async () => {
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

    jest.spyOn(service, 'findAll').mockResolvedValue(vendaItems);

    const result = await controller.findAll();

    expect(result).toBe(vendaItems);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should find venda items by id_venda', async () => {
    const id_venda = 1;
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

    jest.spyOn(service, 'findByIdVenda').mockResolvedValue(vendaItems);

    const result = await controller.findByIdVenda(id_venda);

    expect(result).toBe(vendaItems);
    expect(service.findByIdVenda).toHaveBeenCalledWith(id_venda);
  });
});
