import { Module } from '@nestjs/common';
import { ClienteModule } from './modules/clienteModule';
import { ContaModule } from './modules/contaModule';
import { GerenteModule } from './modules/gerenteModule';

@Module({
  imports: [ClienteModule, ContaModule, GerenteModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
