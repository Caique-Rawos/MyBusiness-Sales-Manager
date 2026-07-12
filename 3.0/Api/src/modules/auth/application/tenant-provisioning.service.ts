import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LojaService } from 'src/modules/loja/application/loja.service';
import { TenantConnectionRegistryService } from 'src/shared/tenant/tenant-connection-registry.service';
import { TenantContextService } from 'src/shared/tenant/tenant-context.service';
import { TENANT_REPOSITORY, TenantRepository } from '../../tenant/domain/tenant.repository';
import { PAPEL_REPOSITORY, PapelRepository } from '../domain/papel.repository';
import { PERMISSAO_REPOSITORY, PermissaoRepository } from '../domain/permissao.repository';
import { USUARIO_REPOSITORY, UsuarioRepository } from '../domain/usuario.repository';
import { AuthResult, AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class TenantProvisioningService {
  constructor(
    @InjectDataSource()
    private readonly defaultDataSource: DataSource,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: UsuarioRepository,
    @Inject(PAPEL_REPOSITORY)
    private readonly papelRepository: PapelRepository,
    @Inject(PERMISSAO_REPOSITORY)
    private readonly permissaoRepository: PermissaoRepository,
    private readonly tenantConnectionRegistry: TenantConnectionRegistryService,
    private readonly tenantContext: TenantContextService,
    private readonly lojaService: LojaService,
    private readonly authService: AuthService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResult> {
    const existing = await this.usuarioRepository.findByEmailComPermissoes(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já está em uso');
    }

    const tenant = await this.tenantRepository.create({ schemaName: 'pending' });
    const schemaName = `tenant_${tenant.id}`;

    try {
      await this.tenantRepository.update(tenant.id, { schemaName });
      await this.defaultDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
      await this.tenantConnectionRegistry.ensureDataSource(schemaName);

      await this.tenantContext.runWithTenant({ schema: schemaName, tenantId: tenant.id }, () =>
        this.lojaService.create({
          nomeFantasia: dto.nomeFantasia,
          cpfCnpj: dto.cpfCnpj,
          endereco: dto.endereco,
          ie: dto.ie,
        }),
      );

      const senhaHash = await bcrypt.hash(dto.senha, 10);
      const usuario = await this.usuarioRepository.create({
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        tenantId: tenant.id,
        isOwner: true,
      });

      const permissoes = await this.permissaoRepository.findAll();
      const papel = await this.papelRepository.create({
        nome: 'Administrador',
        tenantId: tenant.id,
        permissaoIds: permissoes.map((permissao) => permissao.id),
      });
      await this.usuarioRepository.attachPapel(usuario.id, papel.id);

      return this.authService.login(dto.email, dto.senha);
    } catch (error) {
      await this.defaultDataSource
        .query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
        .catch(() => undefined);
      throw error;
    }
  }
}
