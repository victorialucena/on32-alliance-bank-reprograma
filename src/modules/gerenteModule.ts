import { Module, forwardRef } from '@nestjs/common';
import { GerenteService } from '../services/gerenteService';
import { GerenteController } from '../controllers/gerenteController';
import { ClienteModule } from './clienteModule';
import { ContaModule } from './contaModule';

@Module({
  imports: [forwardRef(() => ClienteModule), forwardRef(() => ContaModule) ],
  providers: [GerenteService],
  controllers: [GerenteController],
  exports: [GerenteService]
})
export class GerenteModule { }
