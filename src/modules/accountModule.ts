import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from '../domain/services/accountService';
import { AccountController } from '../application/controllers/accountController';
import { CustomerModule } from './customerModule';
import { ConcreteAccountFactory } from 'src/domain/factorys/factoryAccount';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/domain/entities/entitieAccount';
import { AccountRepository } from 'src/infrastructure/repository/accountRepository';
import { TransactionModule } from './transactionModule';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), forwardRef(() => CustomerModule), forwardRef(() => TransactionModule)],
  providers: [AccountService, ConcreteAccountFactory, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService, ConcreteAccountFactory, AccountRepository],
})
export class AccountModule {}
