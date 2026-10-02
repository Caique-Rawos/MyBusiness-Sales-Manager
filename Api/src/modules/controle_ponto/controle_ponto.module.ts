import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrachaRfidModule } from '../cracha_rfid/cracha_rfid.module';
import { ControlePontoService } from './application/controle_ponto.service';
import { CONTROLE_PONTO_REPOSITORY } from './domain/controle_ponto.repository';
import { ControlePontoOrmEntity } from './infra/typeorm/controle_ponto.entity';
import { ControlePontoTypeOrmRepository } from './infra/typeorm/controle_ponto.repository';
import { ControlePontoController } from './presentation/controle_ponto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ControlePontoOrmEntity]),
    CrachaRfidModule,
  ],
  controllers: [ControlePontoController],
  providers: [
    ControlePontoService,
    {
      provide: CONTROLE_PONTO_REPOSITORY,
      useClass: ControlePontoTypeOrmRepository,
    },
  ],
  exports: [ControlePontoService],
})
export class ControlePontoModule {}