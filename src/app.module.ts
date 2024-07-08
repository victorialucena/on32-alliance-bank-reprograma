import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './Bank/cliente/cliente.module';
import { ContaModule } from './Bank/conta/conta.module';
import { GerenteModule } from './Bank/gerente/gerente.module';

@Module({
  imports: [ClienteModule, ContaModule, GerenteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
