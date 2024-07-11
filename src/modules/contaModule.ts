import { Module, forwardRef } from '@nestjs/common';
import { ContaService } from '../services/contaService';
import { ContaController } from '../controllers/contaController';
import { ClienteModule } from './clienteModule';

@Module({
  imports: [forwardRef(() => ClienteModule)],
  providers: [ContaService],
  controllers: [ContaController],
  exports: [ContaService],
})
export class ContaModule {}
