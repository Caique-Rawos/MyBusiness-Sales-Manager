import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../database/typeorm-options';
import { tenantEntities } from '../entities/tenant-entities';

@Injectable()
export class TenantConnectionRegistryService implements OnModuleDestroy {
  private readonly dataSources = new Map<string, DataSource>();
  private readonly pending = new Map<string, Promise<DataSource>>();

  async onModuleDestroy(): Promise<void> {
    await Promise.all([...this.dataSources.values()].map((dataSource) => dataSource.destroy()));
  }

  async ensureDataSource(schema: string): Promise<DataSource> {
    const existing = this.dataSources.get(schema);
    if (existing) {
      return existing;
    }

    const inFlight = this.pending.get(schema);
    if (inFlight) {
      return inFlight;
    }

    const creation = this.createDataSource(schema);
    this.pending.set(schema, creation);
    try {
      const dataSource = await creation;
      this.dataSources.set(schema, dataSource);
      return dataSource;
    } finally {
      this.pending.delete(schema);
    }
  }

  getDataSource(schema: string): DataSource {
    const dataSource = this.dataSources.get(schema);
    if (!dataSource) {
      throw new Error(
        `Nenhum DataSource inicializado para o schema "${schema}". Chame ensureDataSource() antes de usar o contexto de tenant.`,
      );
    }
    return dataSource;
  }

  private async createDataSource(schema: string): Promise<DataSource> {
    const dataSource = new DataSource({
      ...buildTypeOrmOptions(),
      schema,
      entities: tenantEntities,
      synchronize: false,
      migrations: [__dirname + '/../../migrations/tenant/*{.js,.ts}'],
      // `schema` acima so prefixa queries via QueryBuilder/Repository -- migrations com
      // SQL cru ignoram isso e vao pro search_path da sessao. Sem essa linha, toda
      // migration de tenant cairia sempre em "public", nao no schema deste tenant.
      extra: { max: 5, options: `-c search_path="${schema}"` },
    });
    await dataSource.initialize();
    await dataSource.runMigrations();
    return dataSource;
  }
}
