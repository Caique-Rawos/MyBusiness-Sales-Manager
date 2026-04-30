const fs = require('fs');
const path = require('path');

const root = path.resolve(process.cwd(), 'src', 'modules');

function walk(dir, filter) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(resolved, filter));
    } else if (filter(entry.name)) {
      files.push(resolved);
    }
  }
  return files;
}

function parseClassName(content) {
  const match = /export class\s+(\w+)/.exec(content);
  return match ? match[1] : null;
}

function parseConstructorParams(content) {
  const start = content.indexOf('constructor(');
  if (start === -1) return [];
  let depth = 0;
  let params = '';
  for (let i = start; i < content.length; i += 1) {
    const char = content[i];
    if (char === '(') depth += 1;
    if (char === ')') {
      depth -= 1;
      if (depth === 0) {
        params = content.slice(start + 'constructor'.length + 1, i);
        break;
      }
    }
  }
  if (!params) return [];
  return params
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('@'))
    .map((line) => line.replace(/,$/, '').trim())
    .filter(Boolean)
    .map((param) => {
      const parts = param.split(':').map((part) => part.trim());
      const name = parts[0]
        .replace(/(private|public|protected|readonly)\s*/g, '')
        .trim();
      const type = parts[1] || 'any';
      return { name, type };
    });
}

function parseMethods(content) {
  const methods = [];
  const regex =
    /^(?!\s*(?:constructor|private|protected|async\s+private|async\s+protected))\s*(?:public\s+|private\s+|protected\s+)?(async\s+)?([A-Za-z0-9_]+)\s*\(((?:[^()]*|\([^()]*\))*)\)\s*:\s*Promise<[^>]+>/gm;
  let match;
  while ((match = regex.exec(content))) {
    methods.push({
      name: match[2],
      params: match[3].trim(),
      async: Boolean(match[1]),
    });
  }
  return methods;
}

function normalizeImportPath(from, to) {
  let relative = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  if (!relative.startsWith('.')) relative = `./${relative}`;
  return relative;
}

function ensureLineBreak(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

function writeSpec(filePath, content) {
  fs.writeFileSync(filePath, ensureLineBreak(content));
}

function templateControllerSpec(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const className = parseClassName(content);
  const methods = parseMethods(content).filter((m) => m.name !== 'constructor');
  const constructorParams = parseConstructorParams(content);
  const serviceParam = constructorParams[0];
  if (!className || !serviceParam) return null;

  const serviceType = serviceParam.type;
  const serviceVar = serviceType.charAt(0).toLowerCase() + serviceType.slice(1);
  const serviceImportPath = normalizeImportPath(
    filePath,
    path.resolve(
      path.dirname(filePath),
      `../application/${serviceType.replace(/Service$/, '.service')}.ts`,
    ),
  );

  const methodTests = methods.map((method) => {
    const args = [];
    let expectArgs = [];
    if (
      method.params.includes(': string') &&
      method.name.match(/(findById|update|delete|findByIdVenda)/i)
    ) {
      args.push("'1'");
      expectArgs.push('1');
    } else if (method.params.includes(': string')) {
      args.push(method.name.includes('Alias') ? "'alias'" : "'1'");
      expectArgs.push(args[0]);
    }
    if (method.params.includes('data:')) {
      args.push('{} as any');
      expectArgs.push('{} as any');
    }
    if (method.params && !args.length) {
      const paramParts = method.params
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (paramParts.length === 1) {
        const param = paramParts[0];
        if (param.includes('id')) {
          args.push("'1'");
          expectArgs.push('1');
        } else {
          args.push('{} as any');
          expectArgs.push('{} as any');
        }
      }
    }
    const input = args.join(', ');
    const call = `await expect(controller.${method.name}(${input})).resolves.toBe(result);`;
    const expectedCallArg = expectArgs.length ? expectArgs.join(', ') : input;
    return `  it('should call ${method.name}', async () => {
    const result = {} as any;
    ${serviceVar}.${method.name}.mockResolvedValue(result);
    ${call}
    expect(${serviceVar}.${method.name}).toHaveBeenCalledWith(${expectedCallArg});
  });`;
  });

  return `import { Test, TestingModule } from '@nestjs/testing';
import { ${className} } from './${path.basename(filePath, '.ts')}';
import { ${serviceType} } from '${serviceImportPath.replace(/\.ts$/, '')}';

describe('${className}', () => {
  let controller: ${className};
  let ${serviceVar}: jest.Mocked<${serviceType}>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${className}],
      providers: [
        {
          provide: ${serviceType},
          useValue: {
${methods.map((method) => `            ${method.name}: jest.fn(),`).join('\n')}
          },
        },
      ],
    }).compile();

    controller = module.get<${className}>(${className});
    ${serviceVar} = module.get<${serviceType}>(${serviceType}) as jest.Mocked<${serviceType}>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

${methodTests.join('\n\n')}
});
`;
}

function templateServiceSpec(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const className = parseClassName(content);
  const methods = parseMethods(content).filter((m) => m.name !== 'constructor');
  const constructorParams = parseConstructorParams(content);
  if (!className) return null;

  const deps = constructorParams.map((param) => ({
    name: param.name.replace(/^(private|public|protected|readonly)\s*/g, ''),
    type: param.type,
  }));
  const usesAxios = content.includes('axios.post');

  const importLines = ["import { NotFoundException } from '@nestjs/common';"];
  if (usesAxios) {
    importLines.push("import axios from 'axios';");
  }
  importLines.push(
    `import { ${className} } from './${path.basename(filePath, '.ts')}';`,
  );

  const declarations = deps
    .map((dep) => `  let ${dep.name}: any;`)
    .concat([`  let service: ${className};`])
    .join('\n');

  const beforeEachLines = [
    '  beforeEach(() => {',
    ...deps.map(
      (dep) => `    ${dep.name} = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVendaId: jest.fn(),
      findToday: jest.fn(),
      findByAlias: jest.fn(),
      findVendasFuturasBase: jest.fn(),
      findAllGroupByCliente: jest.fn(),
      findAllGroupByData: jest.fn(),
      getCupomItens: jest.fn(),
      atualizaTotal: jest.fn(),
      atualizaEstoque: jest.fn(),
      findAll: jest.fn(),
    };`,
    ),
    `    service = new ${className}(${deps.map((dep) => dep.name).join(', ')} as any);`,
    '  });',
  ];

  const tests = [];
  function addTest(code) {
    tests.push(code);
  }

  if (methods.some((m) => m.name === 'create')) {
    addTest(`  it('should create', async () => {
    const dto = {} as any;
    const expected = {} as any;
    ${deps[0].name}.create.mockResolvedValue(expected);
    await expect(service.create(dto)).resolves.toBe(expected);
    expect(${deps[0].name}.create).toHaveBeenCalledWith(dto);
  });`);
  }

  if (methods.some((m) => m.name === 'findAll')) {
    addTest(`  it('should find all', async () => {
    const expected = [] as any;
    ${deps[0].name}.findAll.mockResolvedValue(expected);
    await expect(service.findAll()).resolves.toBe(expected);
    expect(${deps[0].name}.findAll).toHaveBeenCalled();
  });`);
  }

  if (methods.some((m) => m.name === 'findById')) {
    addTest(`  it('should find by id', async () => {
    const expected = {} as any;
    ${deps[0].name}.findById.mockResolvedValue(expected);
    await expect(service.findById(1)).resolves.toBe(expected);
    expect(${deps[0].name}.findById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when findById returns null', async () => {
    ${deps[0].name}.findById.mockResolvedValue(null);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });`);
  }

  if (methods.some((m) => m.name === 'update')) {
    addTest(`  it('should update when entity exists', async () => {
    const expected = {} as any;
    ${deps[0].name}.findById.mockResolvedValue({ id: 1 } as any);
    ${deps[0].name}.update.mockResolvedValue(expected);
    await expect(service.update(1, {} as any)).resolves.toBe(expected);
    expect(${deps[0].name}.findById).toHaveBeenCalledWith(1);
    expect(${deps[0].name}.update).toHaveBeenCalledWith(1, {});
  });

  it('should throw NotFoundException when update entity does not exist', async () => {
    ${deps[0].name}.findById.mockResolvedValue(null);
    await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
  });`);
  }

  if (methods.some((m) => m.name === 'delete')) {
    addTest(`  it('should delete when entity exists', async () => {
    ${deps[0].name}.findById.mockResolvedValue({ id: 1 } as any);
    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(${deps[0].name}.findById).toHaveBeenCalledWith(1);
    expect(${deps[0].name}.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when delete entity does not exist', async () => {
    ${deps[0].name}.findById.mockResolvedValue(null);
    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });`);
  }

  if (methods.some((m) => m.name === 'add')) {
    addTest(`  it('should add when autorizado is true and today entry exists', async () => {
    ${deps[0].name}.findToday.mockResolvedValue({ contagem: 1, id: 1 } as any);
    await expect(service.add({ autorizado: true } as any)).resolves.toBe(true);
    expect(${deps[0].name}.findToday).toHaveBeenCalled();
    expect(${deps[0].name}.update).toHaveBeenCalled();
  });

  it('should add when autorizado is true and today entry does not exist', async () => {
    ${deps[0].name}.findToday.mockResolvedValue(null);
    await expect(service.add({ autorizado: true } as any)).resolves.toBe(true);
    expect(${deps[0].name}.create).toHaveBeenCalled();
  });

  it('should return false when autorizado is false', async () => {
    await expect(service.add({ autorizado: false } as any)).resolves.toBe(false);
  });`);
  }

  if (methods.some((m) => m.name === 'findToday')) {
    addTest(`  it('should find today entry', async () => {
    const expected = {} as any;
    ${deps[0].name}.findToday.mockResolvedValue(expected);
    await expect(service.findToday()).resolves.toBe(expected);
    expect(${deps[0].name}.findToday).toHaveBeenCalled();
  });`);
  }

  if (methods.some((m) => m.name === 'atualizaEstoque')) {
    addTest(`  it('should update product stock', async () => {
    ${deps[0].name}.findById.mockResolvedValue({ id: 1, estoque: '10' } as any);
    await expect(service.atualizaEstoque(1, 2)).resolves.toBeUndefined();
    expect(${deps[0].name}.update).toHaveBeenCalledWith(1, { estoque: 8 });
  });

  it('should throw NotFoundException when product is not found', async () => {
    ${deps[0].name}.findById.mockResolvedValue(null);
    await expect(service.atualizaEstoque(1, 2)).rejects.toThrow(NotFoundException);
  });`);
  }

  if (methods.some((m) => m.name === 'findVendasFuturas')) {
    addTest(`  it('should return future sales base data when fewer than three entries exist', async () => {
    const baseData = [{ mes: '2024-01', valorTotal: 100, quantidadeVendas: 1 }];
    ${deps[0].name}.findVendasFuturasBase.mockResolvedValue(baseData);
    await expect(service.findVendasFuturas()).resolves.toEqual(baseData);
    expect(${deps[0].name}.findVendasFuturasBase).toHaveBeenCalled();
  });`);
  }

  if (methods.some((m) => m.name === 'atualizaTotal')) {
    if (deps.length > 1) {
      addTest(`  it('should update total and call related service', async () => {
    ${deps[0].name}.findById.mockResolvedValue({ id: 1 } as any);
    ${deps[0].name}.update.mockResolvedValue({} as any);
    ${deps[1].name}.atualizaTotal.mockResolvedValue(undefined);
    await expect(service.atualizaTotal({ id_venda: 1, total: 50 })).resolves.toBeUndefined();
    expect(${deps[0].name}.findById).toHaveBeenCalledWith(1);
    expect(${deps[0].name}.update).toHaveBeenCalledWith(1, { totalVenda: 50 });
    expect(${deps[1].name}.atualizaTotal).toHaveBeenCalledWith({ id_venda: 1, total: 50 });
  });

  it('should throw NotFoundException when venda is not found', async () => {
    ${deps[0].name}.findById.mockResolvedValue(null);
    await expect(service.atualizaTotal({ id_venda: 1, total: 50 })).rejects.toThrow(NotFoundException);
  });`);
    } else {
      addTest(`  it('should update total when contas receber exists', async () => {
    ${deps[0].name}.findByVendaId.mockResolvedValue({ id: 1 } as any);
    ${deps[0].name}.update.mockResolvedValue({} as any);
    await expect(service.atualizaTotal({ id_venda: 1, total: 50 })).resolves.toBeUndefined();
    expect(${deps[0].name}.findByVendaId).toHaveBeenCalledWith(1);
    expect(${deps[0].name}.update).toHaveBeenCalledWith(1, { valorTotal: 50 });
  });

  it('should throw NotFoundException when contas receber is not found', async () => {
    ${deps[0].name}.findByVendaId.mockResolvedValue(null);
    await expect(service.atualizaTotal({ id_venda: 1, total: 50 })).rejects.toThrow(NotFoundException);
  });`);
    }
  }

  if (methods.some((m) => m.name === 'findByIdVenda')) {
    addTest(`  it('should find by venda id', async () => {
    const expected = [] as any;
    ${deps[0].name}.findByVendaId.mockResolvedValue(expected);
    await expect(service.findByIdVenda(1)).resolves.toBe(expected);
    expect(${deps[0].name}.findByVendaId).toHaveBeenCalledWith(1);
  });`);
  }

  if (methods.some((m) => m.name === 'novoTotalVenda') && deps.length > 1) {
    addTest(`  it('should calculate and update total venda with item subtotals', async () => {
    ${deps[0].name}.findByVendaId.mockResolvedValue([{ subTotal: 10 }, { subTotal: 15 }] as any);
    ${deps[1].name}.atualizaTotal.mockResolvedValue(undefined);
    await expect(service.novoTotalVenda(1)).resolves.toBeUndefined();
    expect(${deps[1].name}.atualizaTotal).toHaveBeenCalledWith({ id_venda: 1, total: 25 });
  });`);
  }

  if (
    methods.some((m) => m.name === 'atualizaEstoqueProduto') &&
    deps.length > 1
  ) {
    addTest(`  it('should call produtoService.atualizaEstoque', async () => {
    ${deps[1].name}.atualizaEstoque.mockResolvedValue(undefined);
    await expect(service.atualizaEstoqueProduto(1, 5)).resolves.toBeUndefined();
    expect(${deps[1].name}.atualizaEstoque).toHaveBeenCalledWith(1, 5);
  });`);
  }

  if (methods.some((m) => m.name === 'findByAlias')) {
    addTest(`  it('should find by alias', async () => {
    const expected = {} as any;
    ${deps[0].name}.findByAlias.mockResolvedValue(expected);
    await expect(service.findByAlias('alias')).resolves.toBe(expected);
    expect(${deps[0].name}.findByAlias).toHaveBeenCalledWith('alias');
  });

  it('should throw NotFoundException when alias not found', async () => {
    ${deps[0].name}.findByAlias.mockResolvedValue(null);
    await expect(service.findByAlias('alias')).rejects.toThrow(NotFoundException);
  });`);
  }

  if (methods.some((m) => m.name === 'findAllGroupByCliente')) {
    addTest(`  it('should group vendas by cliente', async () => {
    ${deps[0].name}.findAllGroupByCliente.mockResolvedValue([{ idCliente: 1, nomeCliente: 'Cliente', valorVendas: '100', quantidadeVendas: '2' }] as any);
    const result = await service.findAllGroupByCliente({} as any);
    expect(result.totalVendas).toBe(100);
    expect(result.quantidadeTotal).toBe(2);
  });`);
  }

  if (methods.some((m) => m.name === 'findAllGroupByData')) {
    addTest(`  it('should group vendas by date', async () => {
    ${deps[0].name}.findAllGroupByData.mockResolvedValue([{ data: '2024-01-01', totalVendas: '100', contagemCliente: '4' }] as any);
    const result = await service.findAllGroupByData({} as any);
    expect(result.totalVendas).toBe(100);
    expect(result.totalClientes).toBe(2);
  });`);
  }

  if (methods.some((m) => m.name === 'generateCupomFiscal')) {
    addTest(`  it('should calculate coupon fiscal values correctly', async () => {
    ${deps[1].name}.findById.mockResolvedValue({ id: 1 } as any);
    ${deps[0].name}.getCupomItens.mockResolvedValue([
      { subtotal: '100', icms: '10', pis: '1', cofins: '2', ipi: '5' },
      { subTotal: '50', icms: '5', pis: '1', cofins: '2', ipi: '0' },
    ]);
    const result = await service.generateCupomFiscal({ idVenda: 1 });
    expect(result.totalVendas).toBe(150);
    expect(result.cupomItens).toHaveLength(2);
  });`);
  }

  const spec = `${importLines.join('\n')}

${declarations}

describe('${className}', () => {
${beforeEachLines.join('\n')}

${tests.join('\n\n')}
});
`;
  return spec;
}

function templateRepositorySpec(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const className = parseClassName(content);
  if (!className) return null;
  const methods = parseMethods(content).filter((m) => m.name !== 'constructor');

  const declarations = `  let typeOrmRepository: any;
  let repository: ${className};`;
  const beforeEach = `  beforeEach(() => {
    typeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getCupomItens: jest.fn(),
    };
    repository = new ${className}(typeOrmRepository as any);
  });`;

  const tests = [];
  if (methods.some((m) => m.name === 'create')) {
    tests.push(`  it('should create an entity', async () => {
    const entity = { id: 1 };
    typeOrmRepository.create.mockReturnValue(entity);
    typeOrmRepository.save.mockResolvedValue(entity);
    await expect(repository.create({} as any)).resolves.toBe(entity);
    expect(typeOrmRepository.create).toHaveBeenCalledWith({} as any);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(entity);
  });`);
  }
  if (methods.some((m) => m.name === 'findAll')) {
    tests.push(`  it('should find all entities', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAll()).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'findById')) {
    tests.push(`  it('should find entity by id', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findById(1)).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'update')) {
    tests.push(`  it('should update an entity', async () => {
    const result = { id: 1 };
    typeOrmRepository.update.mockResolvedValue(undefined);
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.update(1, {} as any)).resolves.toBe(result);
    expect(typeOrmRepository.update).toHaveBeenCalledWith(1, {});
    expect(typeOrmRepository.findOne).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'delete')) {
    tests.push(`  it('should delete an entity', async () => {
    typeOrmRepository.delete.mockResolvedValue(undefined);
    await expect(repository.delete(1)).resolves.toBeUndefined();
    expect(typeOrmRepository.delete).toHaveBeenCalledWith(1);
  });`);
  }
  if (methods.some((m) => m.name === 'findByVendaId')) {
    tests.push(`  it('should find by venda id', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findByVendaId(1)).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'findByAlias')) {
    tests.push(`  it('should find by alias', async () => {
    const result = { id: 1 };
    typeOrmRepository.findOne.mockResolvedValue(result);
    await expect(repository.findByAlias('alias')).resolves.toBe(result);
    expect(typeOrmRepository.findOne).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'getCupomItens')) {
    tests.push(`  it('should retrieve cupom items', async () => {
    const result = [{ id: 1 }];
    typeOrmRepository.getCupomItens.mockResolvedValue(result);
    await expect(repository.getCupomItens(1)).resolves.toBe(result);
    expect(typeOrmRepository.getCupomItens).toHaveBeenCalledWith(1);
  });`);
  }
  if (methods.some((m) => m.name === 'findAllGroupByCliente')) {
    tests.push(`  it('should find all group by cliente', async () => {
    const result = [{ idCliente: 1 }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAllGroupByCliente({} as any)).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });`);
  }
  if (methods.some((m) => m.name === 'findAllGroupByData')) {
    tests.push(`  it('should find all group by data', async () => {
    const result = [{ data: '2024-01-01' }];
    typeOrmRepository.find.mockResolvedValue(result);
    await expect(repository.findAllGroupByData({} as any)).resolves.toBe(result);
    expect(typeOrmRepository.find).toHaveBeenCalled();
  });`);
  }

  return `import { ${className} } from './${path.basename(filePath, '.ts')}';

describe('${className}', () => {
${declarations}

${beforeEach}

${tests.join('\n\n')}
});
`;
}

function main() {
  const controllerFiles = walk(root, (name) => name.endsWith('.controller.ts'));
  const serviceFiles = walk(root, (name) => name.endsWith('.service.ts'));
  const repositoryFiles = walk(root, (name) => name.endsWith('.repository.ts'));

  controllerFiles.forEach((file) => {
    const content = templateControllerSpec(file);
    if (content) writeSpec(`${file.replace(/\.ts$/, '')}.spec.ts`, content);
  });
  serviceFiles.forEach((file) => {
    const content = templateServiceSpec(file);
    if (content) writeSpec(`${file.replace(/\.ts$/, '')}.spec.ts`, content);
  });
  repositoryFiles.forEach((file) => {
    const content = templateRepositorySpec(file);
    if (content) writeSpec(`${file.replace(/\.ts$/, '')}.spec.ts`, content);
  });
}

main();
