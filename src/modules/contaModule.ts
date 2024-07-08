import { Module } from '@nestjs/common';
import { ContaService } from '../services/contaService';
import { ContaController } from '../controllers/contaController';

@Module({
  providers: [ContaService],
  controllers: [ContaController]
})
export class ContaModule { }
