import { Module } from '@nestjs/common';
import { CrachaRfidService } from './application/cracha_rfid.service';
import { CRACHA_RFID_REPOSITORY } from './domain/cracha_rfid.repository';
import { CrachaRfidTypeOrmRepository } from './infra/typeorm/cracha_rfid.repository';
import { CrachaRfidController } from './presentation/cracha_rfid.controller';

@Module({
  controllers: [CrachaRfidController],
  providers: [
    CrachaRfidService,
    {
      provide: CRACHA_RFID_REPOSITORY,
      useClass: CrachaRfidTypeOrmRepository,
    },
  ],
  exports: [CrachaRfidService],
})
export class CrachaRfidModule {}
