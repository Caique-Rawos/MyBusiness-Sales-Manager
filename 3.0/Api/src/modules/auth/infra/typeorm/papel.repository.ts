import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePapelData, PapelRepository, UpdatePapelData } from '../../domain/papel.repository';
import { Papel, PapelComPermissoes } from '../../domain/papel';
import { PapelOrmEntity } from './papel.entity';

@Injectable()
export class PapelTypeOrmRepository implements PapelRepository {
  constructor(
    @InjectRepository(PapelOrmEntity)
    private readonly repository: Repository<PapelOrmEntity>,
  ) {}

  async create(data: CreatePapelData): Promise<Papel> {
    const object = this.repository.create({
      nome: data.nome,
      tenantId: data.tenantId,
      permissoes: data.permissaoIds.map((id) => ({ id }) as any),
    });
    const saved = await this.repository.save(object);
    return { id: saved.id, nome: saved.nome, tenantId: saved.tenantId };
  }

  async findAllByTenantId(tenantId: number): Promise<PapelComPermissoes[]> {
    const papeis = await this.repository.find({
      where: { tenantId },
      relations: ['permissoes'],
      order: { id: 'ASC' },
    });
    return papeis.map(this.toPapelComPermissoes);
  }

  async findByIdAndTenantId(id: number, tenantId: number): Promise<PapelComPermissoes | null> {
    const papel = await this.repository.findOne({
      where: { id, tenantId },
      relations: ['permissoes'],
    });
    return papel ? this.toPapelComPermissoes(papel) : null;
  }

  async update(id: number, data: UpdatePapelData): Promise<Papel> {
    if (data.nome !== undefined) {
      await this.repository.update(id, { nome: data.nome });
    }

    if (data.permissaoIds !== undefined) {
      const papel = await this.repository.findOne({ where: { id }, relations: ['permissoes'] });
      const currentIds = papel?.permissoes.map((permissao) => permissao.id) ?? [];
      const toAdd = data.permissaoIds.filter((permissaoId) => !currentIds.includes(permissaoId));
      const toRemove = currentIds.filter((permissaoId) => !data.permissaoIds!.includes(permissaoId));

      const relation = this.repository
        .createQueryBuilder()
        .relation(PapelOrmEntity, 'permissoes')
        .of(id);
      if (toAdd.length > 0) {
        await relation.add(toAdd);
      }
      if (toRemove.length > 0) {
        await relation.remove(toRemove);
      }
    }

    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Papel not found');
    }
    return { id: updated.id, nome: updated.nome, tenantId: updated.tenantId };
  }

  async delete(id: number): Promise<void> {
    const papel = await this.repository.findOne({ where: { id }, relations: ['permissoes'] });
    const permissaoIds = papel?.permissoes.map((permissao) => permissao.id) ?? [];

    if (permissaoIds.length > 0) {
      await this.repository.createQueryBuilder().relation(PapelOrmEntity, 'permissoes').of(id).remove(permissaoIds);
    }
    await this.repository.delete(id);
  }

  private toPapelComPermissoes(papel: PapelOrmEntity): PapelComPermissoes {
    return {
      id: papel.id,
      nome: papel.nome,
      tenantId: papel.tenantId,
      permissoes: papel.permissoes.map((permissao) => ({
        id: permissao.id,
        chave: permissao.chave,
        descricao: permissao.descricao,
      })),
    };
  }
}
