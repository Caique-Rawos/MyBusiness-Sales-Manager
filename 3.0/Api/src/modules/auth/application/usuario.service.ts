import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USUARIO_REPOSITORY, UsuarioRepository } from '../domain/usuario.repository';
import { UsuarioComPapeis } from '../domain/usuario';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async create(dto: CreateUsuarioDto, tenantId: number): Promise<UsuarioComPapeis> {
    const existing = await this.usuarioRepository.findByEmailComPermissoes(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já está em uso');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const usuario = await this.usuarioRepository.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      tenantId,
    });

    if (dto.papelIds.length > 0) {
      await this.usuarioRepository.setPapeis(usuario.id, dto.papelIds);
      return (await this.usuarioRepository.findByIdComPapeis(usuario.id))!;
    }

    return { ...usuario, papeis: [] };
  }

  async findAllByTenant(tenantId: number): Promise<UsuarioComPapeis[]> {
    return this.usuarioRepository.findAllByTenantId(tenantId);
  }

  async updatePapeis(id: number, tenantId: number, papelIds: number[]): Promise<void> {
    const usuario = await this.usuarioRepository.findByIdAndTenantId(id, tenantId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.usuarioRepository.setPapeis(id, papelIds);
  }

  async remove(id: number, tenantId: number, currentUserId: number): Promise<void> {
    const usuario = await this.usuarioRepository.findByIdAndTenantId(id, tenantId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.isOwner) {
      throw new BadRequestException('Não é possível excluir o dono da loja');
    }

    if (usuario.id === currentUserId) {
      throw new BadRequestException('Não é possível excluir seu próprio usuário');
    }

    await this.usuarioRepository.delete(id);
  }

  async existsByPapelId(papelId: number): Promise<boolean> {
    return this.usuarioRepository.existsByPapelId(papelId);
  }
}
