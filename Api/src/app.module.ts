import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginasModule } from './app/paginas/paginas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'roundhouse.proxy.rlwy.net',
      port: 47653,
      username: 'postgres',
      password: 'yFWpBWJjFLSeSGQhArpUrZSUHWNqDJLC',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    PaginasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
