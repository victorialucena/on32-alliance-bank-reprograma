import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';

@Module({
  providers: [ClienteService],
  controllers: [ClienteController],
  exports: [ClienteService],
})

export class ClienteModule {}
