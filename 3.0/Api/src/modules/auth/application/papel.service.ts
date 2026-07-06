import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PAPEL_REPOSITORY, PapelRepository } from '../domain/papel.repository';
import { Papel, PapelComPermissoes } from '../domain/papel';
import { CreatePapelDto } from './dto/create-papel.dto';
import { UpdatePapelDto } from './dto/update-papel.dto';
import { UsuarioService } from './usuario.service';

@Injectable()
export class PapelService {
  constructor(
    @Inject(PAPEL_REPOSITORY)
    private readonly papelRepository: PapelRepository,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(dto: CreatePapelDto, tenantId: number): Promise<Papel> {
    return this.papelRepository.create({
      nome: dto.nome,
      tenantId,
      permissaoIds: dto.permissaoIds,
    });
  }

  async findAllByTenant(tenantId: number): Promise<PapelComPermissoes[]> {
    return this.papelRepository.findAllByTenantId(tenantId);
  }

  async update(id: number, tenantId: number, dto: UpdatePapelDto): Promise<Papel> {
    const papel = await this.papelRepository.findByIdAndTenantId(id, tenantId);
    if (!papel) {
      throw new NotFoundException('Papel não encontrado');
    }

    return this.papelRepository.update(id, dto);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const papel = await this.papelRepository.findByIdAndTenantId(id, tenantId);
    if (!papel) {
      throw new NotFoundException('Papel não encontrado');
    }

    const emUso = await this.usuarioService.existsByPapelId(id);
    if (emUso) {
      throw new ConflictException('Papel está atribuído a usuários e não pode ser removido');
    }

    await this.papelRepository.delete(id);
  }
}
