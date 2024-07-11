import { Module, forwardRef } from '@nestjs/common';
import { ClienteService } from '../services/clienteService';
import { ClienteController } from '../controllers/clienteController';
import { ContaModule } from './contaModule';

@Module({
  imports: [forwardRef(() => ContaModule)],
  providers: [ClienteService],
  controllers: [ClienteController],
  exports: [ClienteService],
})
export class ClienteModule {}
