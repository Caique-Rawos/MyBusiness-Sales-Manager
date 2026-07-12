import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioData, UsuarioRepository } from '../../domain/usuario.repository';
import { Usuario, UsuarioComPapeis, UsuarioComPermissoes } from '../../domain/usuario';
import { UsuarioOrmEntity } from './usuario.entity';

@Injectable()
export class UsuarioTypeOrmRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repository: Repository<UsuarioOrmEntity>,
  ) {}

  async create(data: CreateUsuarioData): Promise<Usuario> {
    const object = this.repository.create(data);
    return this.repository.save(object);
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmailComPermissoes(email: string): Promise<UsuarioComPermissoes | null> {
    const usuario = await this.repository.findOne({
      where: { email },
      relations: ['papeis', 'papeis.permissoes'],
    });
    return this.toUsuarioComPermissoes(usuario);
  }

  async findByIdComPermissoes(id: number): Promise<UsuarioComPermissoes | null> {
    const usuario = await this.repository.findOne({
      where: { id },
      relations: ['papeis', 'papeis.permissoes'],
    });
    return this.toUsuarioComPermissoes(usuario);
  }

  async findAllByTenantId(tenantId: number): Promise<UsuarioComPapeis[]> {
    const usuarios = await this.repository.find({
      where: { tenantId },
      relations: ['papeis'],
      order: { id: 'ASC' },
    });
    return usuarios.map((usuario) => ({
      ...usuario,
      papeis: usuario.papeis.map((papel) => ({ id: papel.id, nome: papel.nome })),
    }));
  }

  async findByIdAndTenantId(id: number, tenantId: number): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id, tenantId } });
  }

  async findByIdComPapeis(id: number): Promise<UsuarioComPapeis | null> {
    const usuario = await this.repository.findOne({ where: { id }, relations: ['papeis'] });
    if (!usuario) {
      return null;
    }
    return { ...usuario, papeis: usuario.papeis.map((papel) => ({ id: papel.id, nome: papel.nome })) };
  }

  async attachPapel(usuarioId: number, papelId: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(UsuarioOrmEntity, 'papeis')
      .of(usuarioId)
      .add(papelId);
  }

  async setPapeis(usuarioId: number, papelIds: number[]): Promise<void> {
    const usuario = await this.repository.findOne({
      where: { id: usuarioId },
      relations: ['papeis'],
    });
    const currentIds = usuario?.papeis.map((papel) => papel.id) ?? [];
    const toAdd = papelIds.filter((id) => !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !papelIds.includes(id));

    const relation = this.repository
      .createQueryBuilder()
      .relation(UsuarioOrmEntity, 'papeis')
      .of(usuarioId);
    if (toAdd.length > 0) {
      await relation.add(toAdd);
    }
    if (toRemove.length > 0) {
      await relation.remove(toRemove);
    }
  }

  async existsByPapelId(papelId: number): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.papeis', 'papel', 'papel.id = :papelId', { papelId })
      .getCount();
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.setPapeis(id, []);
    await this.repository.delete(id);
  }

  private toUsuarioComPermissoes(
    usuario: UsuarioOrmEntity | null,
  ): UsuarioComPermissoes | null {
    if (!usuario) {
      return null;
    }

    const permissions = Array.from(
      new Set(usuario.papeis.flatMap((papel) => papel.permissoes.map((permissao) => permissao.chave))),
    );

    return { ...usuario, permissions };
  }
}
