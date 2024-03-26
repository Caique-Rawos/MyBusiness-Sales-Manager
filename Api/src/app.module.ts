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
      password: 'a268568341307e68c28b',
      database: 'api_my_business_sales_manager_',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    PaginasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
