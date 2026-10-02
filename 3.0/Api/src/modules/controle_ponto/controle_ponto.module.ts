import { Module } from '@nestjs/common';
import { CrachaRfidModule } from '../cracha_rfid/cracha_rfid.module';
import { ControlePontoService } from './application/controle_ponto.service';
import { CONTROLE_PONTO_REPOSITORY } from './domain/controle_ponto.repository';
import { ControlePontoTypeOrmRepository } from './infra/typeorm/controle_ponto.repository';
import { ControlePontoController } from './presentation/controle_ponto.controller';

@Module({
  imports: [CrachaRfidModule],
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
