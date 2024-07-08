import { Module } from '@nestjs/common';
import { GerenteService } from '../services/gerenteService';
import { GerenteController } from '../controllers/gerenteController';
import { ClienteModule } from './clienteModule';

@Module({
  imports: [ClienteModule],
  providers: [GerenteService],
  controllers: [GerenteController],
})
export class GerenteModule { }
