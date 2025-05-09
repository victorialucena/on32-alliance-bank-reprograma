import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Transaction } from 'src/domain/entities/entitieTransaction';
import { TransactionRepository } from 'src/infrastructure/repository/transactionRepository'; // Ajuste o caminho conforme necessário
import { AccountRepository } from 'src/infrastructure/repository/accountRepository'; // Importa o repositório de conta
import { AccountService } from './accountService';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async createTransaction(
    type: string, 
    amount: number,
    balanceAfterTransaction: number,
    accountNumber: string
  ): Promise<Transaction> {
    const account = await this.accountService.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    const transaction = new Transaction();
    transaction.type = type as any; 
    transaction.amount = amount;
    transaction.balanceAfterTransaction = balanceAfterTransaction;
    transaction.account = account;

    return await this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }
}
