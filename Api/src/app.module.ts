import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginasModule } from './app/paginas/paginas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'mybusiness.caiquerawos.com',
      port: 5432,
      username: 'postgres',
      password: 'ec194c3ca95030a58c0f',
      database: 'my-business-sales-manager',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    PaginasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
