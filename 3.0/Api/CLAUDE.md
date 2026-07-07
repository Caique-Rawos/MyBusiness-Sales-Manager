# MyBusiness Sales Manager — API

## Memória de Sessões Anteriores

Decisões, padrões e feedbacks acumulados estão em `memory/`. Leia os arquivos relevantes no início de cada sessão antes de implementar qualquer coisa.

---

## Visão Geral

API REST construída com **NestJS + TypeScript + TypeORM + PostgreSQL**, seguindo **Arquitetura Hexagonal** com princípios de **Domain-Driven Design (DDD)**.

### Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| NestJS | 11.x | Framework HTTP / DI container |
| TypeScript | 5.1 | Linguagem |
| TypeORM | 0.3.x | ORM |
| PostgreSQL | — | Banco de dados |
| BullMQ + Redis | — | Filas assíncronas (event-driven) |
| class-validator | — | Validação de DTOs |
| @nestjs/swagger | — | Documentação OpenAPI (`/api/docs`) |
| Jest | 29.x | Testes unitários e e2e |
| Supertest | — | Testes e2e HTTP |

---

## Arquitetura Hexagonal + DDD

### Conceito

A Arquitetura Hexagonal (Ports & Adapters) isola o núcleo da aplicação de detalhes de infraestrutura. A regra fundamental é:

> **Camadas internas nunca dependem de camadas externas.** O domínio não conhece NestJS, TypeORM ou qualquer framework.

```
┌──────────────────────────────────────────────┐
│  Presentation (HTTP - NestJS Controllers)     │  ← camada mais externa
│  ┌────────────────────────────────────────┐   │
│  │  Application (Services / Use Cases)   │   │
│  │  ┌──────────────────────────────────┐ │   │
│  │  │  Domain (Entities + Ports)       │ │   │  ← núcleo puro (sem frameworks)
│  │  └──────────────────────────────────┘ │   │
│  └────────────────────────────────────────┘   │
│  Infrastructure (TypeORM Repositories)        │  ← adaptadores de tecnologia
└──────────────────────────────────────────────┘
```

---

## Estrutura de Módulos

Cada feature fica dentro de `src/modules/{nome_modulo}/` e segue **exatamente** esta estrutura:

```
src/modules/{nome_modulo}/
├── domain/
│   ├── {nome}.ts                      # Interface da entidade de domínio
│   └── {nome}.repository.ts           # Interface do repositório (Port)
│
├── application/
│   ├── {nome}.service.ts              # Orquestração dos casos de uso
│   └── dto/
│       ├── create-{nome}.dto.ts       # DTO de criação
│       └── update-{nome}.dto.ts       # DTO de atualização
│
├── infra/
│   └── typeorm/
│       ├── {nome}.entity.ts           # Entidade ORM (mapeamento banco)
│       └── {nome}.repository.ts       # Implementação do repositório (Adapter)
│
├── presentation/
│   └── {nome}.controller.ts           # Controller HTTP (Adapter de entrada)
│
└── {nome}.module.ts                   # Definição do módulo NestJS
```

### Por que essa estrutura?

- `domain/` é o núcleo — interfaces puras, sem imports de frameworks
- `application/` orquestra — conhece o domínio, nunca acessa banco diretamente
- `infra/` implementa — detalhes técnicos (TypeORM), pode ser trocado sem alterar domínio
- `presentation/` expõe — recebe HTTP, delega para o service, retorna resposta

---

## Responsabilidades por Camada

### Domain (`domain/`)

**O que faz:** Define o modelo de negócio e os contratos (ports).

**Regras:**
- Apenas interfaces TypeScript puras — sem decorators de framework
- A entidade de domínio é a "verdade" do negócio, não a entidade ORM
- O repositório é uma interface (Port) — define o contrato, não implementa

**Exemplo — `venda_item/domain/venda_item.ts`:**
```typescript
export interface VendaItem {
  id: number;
  precoUnitario: number;
  desconto?: number;
  quantidade: number;
  subTotal: number;
  idVenda: number;
  idProduto: number;
}
```

**Exemplo — `venda_item/domain/venda_item.repository.ts`:**
```typescript
export const VENDA_ITEM_REPOSITORY = 'VENDA_ITEM_REPOSITORY';

export interface VendaItemRepository {
  create(data: CreateVendaItemDto): Promise<VendaItem>;
  findAll(): Promise<VendaItem[]>;
  findById(id: number): Promise<VendaItem | null>;
  update(id: number, data: UpdateVendaItemDto): Promise<VendaItem>;
  delete(id: number): Promise<void>;
}
```

---

### Application (`application/`)

**O que faz:** Implementa os casos de uso e orquestra o domínio.

**Regras:**
- Injeta o repositório pela interface (nunca pela implementação concreta)
- Pode injetar services de outros módulos para operações cross-module
- Lança exceções do NestJS (`NotFoundException`, `BadRequestException`) quando necessário
- Não acessa TypeORM diretamente

**Padrão de injeção do repositório:**
```typescript
@Injectable()
export class VendaItemService {
  constructor(
    @Inject(VENDA_ITEM_REPOSITORY)
    private readonly repository: VendaItemRepository,  // ← interface, não implementação
    private readonly vendaService: VendaService,        // ← service de outro módulo
  ) {}
}
```

**Verificação de existência antes de update/delete:**
```typescript
async delete(id: number): Promise<void> {
  const exists = await this.repository.findById(id);
  if (!exists) {
    throw new NotFoundException('VendaItem not found');
  }
  await this.repository.delete(id);
}
```

---

### Infrastructure (`infra/typeorm/`)

**O que faz:** Implementa os ports definidos no domínio usando TypeORM.

**Regras:**
- A entidade ORM (`{Nome}OrmEntity`) é separada da entidade de domínio
- Decorators TypeORM ficam apenas nessa camada
- O repositório concreto implementa a interface do domínio

**Convenção de nomes:**
- Entidade ORM: `VendaItemOrmEntity` (sufixo `OrmEntity`)
- Repositório: `VendaItemTypeOrmRepository` (sufixo `TypeOrmRepository`)

**Precisão numérica para valores financeiros:**
```typescript
@Column({ type: 'numeric', precision: 13, scale: 2 })
precoUnitario!: number;
```

**Exemplo de entidade ORM:**
```typescript
@Entity({ name: 'venda_item' })
export class VendaItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VendaOrmEntity)
  @JoinColumn({ name: 'id_venda' })
  venda: VendaOrmEntity;
}
```

---

### Presentation (`presentation/`)

**O que faz:** Expõe endpoints HTTP, delega toda lógica para o Service.

**Regras:**
- Zero lógica de negócio — apenas recebe, converte tipos e delega
- Usa os DTOs da camada `application/dto/`
- Retorna o tipo de domínio (interface), nunca a entidade ORM diretamente

**Exemplo:**
```typescript
@Controller('venda-item')
export class VendaItemController {
  constructor(private readonly vendaItemService: VendaItemService) {}

  @Post()
  async create(@Body() data: CreateVendaItemDto): Promise<VendaItem> {
    return await this.vendaItemService.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<VendaItem> {
    return this.vendaItemService.findById(Number(id));  // converte string → number aqui
  }
}
```

---

### Module (`{nome}.module.ts`)

**O que faz:** Conecta as peças — registra providers, importa dependências, exporta services.

**Padrão de registro do repositório (Dependency Inversion):**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([VendaItemOrmEntity]), VendaModule, ProdutoModule],
  controllers: [VendaItemController],
  providers: [
    VendaItemService,
    {
      provide: VENDA_ITEM_REPOSITORY,     // ← token (string constant do domain/)
      useClass: VendaItemTypeOrmRepository, // ← implementação concreta (infra/)
    },
  ],
  exports: [VendaItemService],  // ← exporta service para outros módulos usarem
})
export class VendaItemModule {}
```

---

## Módulos Existentes

| Módulo | Propósito | Dependências |
|---|---|---|
| `categoria` | Categorias de produto | — |
| `cliente` | Clientes | venda (via VendaModule para delete check) |
| `contagem_cliente` | Contagem de visitantes (IoT) | — |
| `contas_pagar` | Contas a pagar | pagamento, status_pagamento |
| `contas_receber` | Contas a receber | pagamento, status_pagamento; fila `contas-receber` |
| `estoque` | Movimentação de estoque | TypeORM direto (ProdutoOrmEntity) |
| `loja` | Dados da loja | — |
| `pagamento` | Formas de pagamento | — |
| `produto` | Estoque de produtos | categoria, regra_fiscal, venda_item (delete check) |
| `regra_fiscal` | Regras tributárias (ICMS, PIS, COFINS, IPI) | — |
| `status_pagamento` | Status de pagamento | — |
| `venda` | Vendas / Pedidos | filas `venda`, `estoque`, `contas-receber` |
| `venda_item` | Itens de venda | filas `venda`, `estoque` |
| `venda_relatorio` | Relatórios e analytics | venda, loja, regra_fiscal |

---

## Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Pasta do módulo | `snake_case` | `venda_item/` |
| Interface de domínio | `PascalCase` | `VendaItem` |
| Interface de repositório | `PascalCase + Repository` | `VendaItemRepository` |
| Token de injeção | `SCREAMING_SNAKE_CASE` | `VENDA_ITEM_REPOSITORY` |
| Entidade ORM | `PascalCase + OrmEntity` | `VendaItemOrmEntity` |
| Repositório concreto | `PascalCase + TypeOrmRepository` | `VendaItemTypeOrmRepository` |
| Service | `PascalCase + Service` | `VendaItemService` |
| Controller | `PascalCase + Controller` | `VendaItemController` |
| DTO de criação | `Create{Nome}Dto` | `CreateVendaItemDto` |
| DTO de atualização | `Update{Nome}Dto` | `UpdateVendaItemDto` |
| Arquivo de módulo | `{nome}.module.ts` | `venda_item.module.ts` |

---

## Testes

### Estrutura

Cada arquivo de produção tem seu `.spec.ts` no mesmo diretório:
```
venda_item.service.ts
venda_item.service.spec.ts
venda_item.repository.ts  (infra/)
venda_item.repository.spec.ts
```

### Padrão de teste de Service

O repositório é mockado — o service é testado isolado da infra:

```typescript
describe('VendaItemService', () => {
  let service: VendaItemService;
  let repository: jest.Mocked<VendaItemRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VendaItemService,
        {
          provide: VENDA_ITEM_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(VendaItemService);
    repository = module.get(VENDA_ITEM_REPOSITORY);
  });

  it('should throw NotFoundException when item not found', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });
});
```

### Padrão de teste de Repository

O TypeORM é mockado via `getRepositoryToken`:

```typescript
const module = await Test.createTestingModule({
  providers: [
    VendaItemTypeOrmRepository,
    {
      provide: getRepositoryToken(VendaItemOrmEntity),
      useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn() },
    },
  ],
}).compile();
```

### Exclusões do coverage (jest.config.ts)

Não gerar coverage de: entidades ORM, DTOs, arquivos `.module.ts`, `main.ts`.

---

## Como Adicionar um Novo Módulo

1. Criar a pasta `src/modules/{nome}/`
2. Criar `domain/{nome}.ts` — interface da entidade
3. Criar `domain/{nome}.repository.ts` — interface + token de injeção
4. Criar `application/dto/create-{nome}.dto.ts` e `update-{nome}.dto.ts`
5. Criar `application/{nome}.service.ts` — injeta repositório pela interface
6. Criar `infra/typeorm/{nome}.entity.ts` — entidade ORM com decorators TypeORM
7. Criar `infra/typeorm/{nome}.repository.ts` — implementa a interface do domínio
8. Criar `presentation/{nome}.controller.ts` — endpoints HTTP
9. Criar `{nome}.module.ts` — registra providers com o padrão `provide/useClass`
10. Importar o módulo em `src/app.module.ts`

---

## Arquitetura Event-Driven com BullMQ

Operações cross-aggregate assíncronas são feitas via filas BullMQ em vez de injeção direta de serviço. Isso elimina dependências circulares e garante integridade com retry automático.

### Filas e Processadores

| Fila | Processor | Jobs |
|---|---|---|
| `venda` | `VendaProcessor` | `calcular-total` — soma subtotais → atualiza `totalVenda` → emite `atualizar-total` |
| `estoque` | `EstoqueProcessor` | `saida` — decrementa estoque + registra `MovimentoEstoque(SAIDA)` |
| `estoque` | `EstoqueProcessor` | `estorno` — reverte saída + registra `MovimentoEstoque(ESTORNO_SAIDA)` |
| `contas-receber` | `ContasReceberProcessor` | `atualizar-total` — atualiza `valorTotal` na conta a receber |

### Quem emite o quê

```
VendaItemService.create()
  → venda:calcular-total  { idVenda }
  → estoque:saida         { idProduto, quantidade, idVenda, idVendaItem }

VendaItemService.delete()
  → estoque:estorno       { idVendaItem }
  → venda:calcular-total  { idVenda }

VendaService.delete()
  → estoque:estorno       { idVendaItem }  (um por item da venda)
  → repository.delete()   (CASCADE remove venda_item e contas_receber)
```

### Módulo Estoque

`src/modules/estoque/` — registra toda movimentação de estoque:

```typescript
// MovimentoEstoqueOrmEntity
{
  tipo: 'SAIDA' | 'ESTORNO_SAIDA' | 'ENTRADA',
  quantidade: number,
  idProduto: number,
  idVenda?: number,
  idVendaItem?: number,
  dataMovimento: Date,
}
```

O `EstoqueProcessor` acessa `ProdutoOrmEntity` via TypeORM direto (sem importar `ProdutoModule`) para evitar dependência circular.

### Cascades no banco

```typescript
// VendaItemOrmEntity — ao deletar Venda, itens são deletados em cascade
@ManyToOne(() => VendaOrmEntity, { onDelete: 'CASCADE' })

// ContasReceberOrmEntity — ao deletar Venda, conta a receber é deletada em cascade
@OneToOne(() => VendaOrmEntity, { onDelete: 'CASCADE' })
```

### Validação de delete com ConflictException

```typescript
// ProdutoService.delete() — impede remoção se produto tem itens de venda
const referenced = await this.vendaItemService.existsByProdutoId(id);
if (referenced) throw new ConflictException('...');

// ClienteService.delete() — impede remoção se cliente tem vendas
const referenced = await this.vendaService.existsByClienteId(id);
if (referenced) throw new ConflictException('...');
```

### Configuração Redis

```env
REDIS_HOST = localhost
REDIS_PORT = 6379
```

`BullModule.forRoot()` configurado no `AppModule`. Cada módulo que produz ou consome fila declara `BullModule.registerQueue({ name: '...' })`.

---

## Decisões de Projeto

### TypeORM Migrations

`synchronize: false` em `app.module.ts` — schema versionado via migrations (`src/migrations/`), não mais alterado automaticamente. `entities` é um array explícito (`catalogEntities` + `tenantEntities`, em `src/shared/entities/`), não mais um glob, já que agora existem dois grupos de entidades sob `modules/**` (catálogo central multi-tenant vs. dados de negócio).

CLI (usa `src/data-source.ts`):
```bash
npm run migration:generate -- src/migrations/NomeDaMigration
npm run migration:run
npm run migration:revert
```

`migrationsRun: true` roda as migrations pendentes automaticamente no boot.

### CORS

Configurado em `main.ts` via `CORS_ORIGIN` (lista de origens separadas por vírgula). Sem a env var, cai no fallback `http://localhost:5173` (dev local).

### Variáveis de ambiente

Configuradas via `.env` (não versionar). Ver `.env.example` para o template. Lidas pelo `ConfigModule.forRoot()` do NestJS.

### Forecasting com ML externo

`venda_relatorio` integra com um serviço Python externo via HTTP (axios) para previsão de vendas. Endpoint configurado como URL hardcoded no service — candidato a variável de ambiente.

### Linguagem do domínio

Nomenclatura em português, espelhando o ubiquitous language do negócio (venda, produto, cliente, nota fiscal, etc.). Manter essa convenção em novos módulos.

---

## O que Está Bem Aplicado

- Separação clara das 4 camadas em cada módulo
- Repositório injetado por interface (Dependency Inversion Principle)
- Entidade ORM separada da entidade de domínio
- Token de injeção (`VENDA_ITEM_REPOSITORY`) no arquivo do domínio
- Service exportado pelo módulo para uso cross-module
- Coordenação cross-aggregate via filas BullMQ (sem dependência circular)
- Movimentação de estoque rastreada em tabela própria (`movimento_estoque`)
- Precisão financeira nos campos numéricos (`precision: 13, scale: 2`)
- Validação de DTOs com `class-validator` + `ValidationPipe` global
- Documentação OpenAPI disponível em `/api/docs`
- Delete com `ConflictException` quando entidade tem vínculos ativos
- Cascade no banco para deleção de `venda_item` e `contas_receber` ao deletar venda
- 42 arquivos de teste cobrindo services e repositories (272 testes)

---

## Melhorias Conhecidas (Discutir Antes de Implementar)

Estas são lacunas identificadas em relação às melhores práticas de DDD. **Nenhuma deve ser implementada sem alinhamento prévio.**

| Melhoria | Descrição |
|---|---|
| Value Objects | Encapsular `Money`, `Quantidade`, `Percentual` como classes com validação própria |
| Filtros de exceção | Criar `HttpExceptionFilter` global para padronizar respostas de erro |
| URL do serviço ML | Mover URL hardcoded do forecasting para variável de ambiente |
| Testes e2e | Expandir cobertura além do health check |
| Entrada de estoque | `EstoqueModule` já suporta `TipoMovimento.ENTRADA` — implementar endpoint e job |

---

## Regras para o Assistente (Claude)

- **Sempre pedir confirmação** antes de refatorar, mover arquivos, mudar estrutura ou alterar padrões arquiteturais
- Nunca tomar decisões de arquitetura sozinho — apresentar opções e aguardar aprovação
- Novos módulos devem seguir exatamente a estrutura de 4 camadas documentada acima
- Não adicionar lógica de negócio em controllers
- Não acessar TypeORM direto de services — passar sempre pelo repositório
- Manter nomenclatura em português para conceitos de domínio
