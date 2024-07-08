import { Module } from '@nestjs/common';
import { ClienteService } from '../services/clienteService';
import { ClienteController } from '../controllers/clienteController';

@Module({
  providers: [ClienteService],
  controllers: [ClienteController],
  exports: [ClienteService],
})

export class ClienteModule { }
