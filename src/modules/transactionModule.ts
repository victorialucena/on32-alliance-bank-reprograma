import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/entities/entitieTransaction';
import { TransactionService } from 'src/domain/services/transactionService';
import { TransactionRepository } from 'src/infrastructure/repository/transactionRepository';
import { AccountModule } from './accountModule';
import { TransactionController } from 'src/application/controllers/transactionController';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), forwardRef(() => AccountModule)],
  providers: [TransactionService, TransactionRepository, TransactionController],
  controllers: [TransactionController],
  exports: [TransactionService, TransactionController], 
})
export class TransactionModule {}
