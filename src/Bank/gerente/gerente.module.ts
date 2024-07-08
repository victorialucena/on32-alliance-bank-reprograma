import { Module } from '@nestjs/common';
import { GerenteService } from './gerente.service';
import { GerenteController } from './gerente.controller';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  imports: [ClienteModule], 
  providers: [GerenteService],
  controllers: [GerenteController],
})
export class GerenteModule {}
