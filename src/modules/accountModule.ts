import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from '../services/accountService';
import { AccountController } from '../controllers/accountController';
import { CustomerModule } from './customerModule';
import { ConcreteAccountFactory } from 'src/factorys/factoryAccount';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/entitieAccount';
import { AccountRepository } from 'src/repository/accountRepository';

@Module({
  imports: [forwardRef(() => CustomerModule), TypeOrmModule.forFeature([Account])], 
  providers: [AccountService, ConcreteAccountFactory, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService, ConcreteAccountFactory, AccountRepository], 
})
export class AccountModule {}
