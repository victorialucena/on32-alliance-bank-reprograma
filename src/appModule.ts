import { Module } from '@nestjs/common';
import { ClienteModule } from './modules/clienteModule';
import { ContaModule } from './modules/contaModule';
import { GerenteModule } from './modules/gerenteModule';
import { ClienteController } from './controllers/clienteController';
import { ContaController } from './controllers/contaController';

@Module({
  imports: [ClienteModule, ContaModule, GerenteModule],
  controllers: [ClienteController, ContaController],
  providers: [],
})
export class AppModule { }
