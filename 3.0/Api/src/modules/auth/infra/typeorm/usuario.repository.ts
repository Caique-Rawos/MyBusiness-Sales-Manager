import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioData, UsuarioRepository } from '../../domain/usuario.repository';
import { Usuario, UsuarioComPermissoes } from '../../domain/usuario';
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
