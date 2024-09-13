import { TransactionService } from 'src/domain/services/transactionService';
import { BadRequestException, Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { CurrentAccount } from '../entities/entiteCurrentAccount';
import { SavingsAccount } from '../entities/entitieSavingsAccount';
import { CustomerService } from './customerService';
import { Account } from 'src/domain/entities/entitieAccount';
import { Customer } from 'src/domain/entities/entitieCustomer';
import { IAccountFactory } from 'src/domain/interfaces/IAccountFactory';
import { AccountType } from 'src/domain/enums/enumAccountType';
import { AccountRepository } from 'src/infrastructure/repository/accountRepository';
import { ConcreteAccountFactory } from 'src/domain/factorys/factoryAccount';
import { CurrentAccountDTO } from 'src/application/dtos/currentAccountDTO';
import { SavingsAccountDTO } from 'src/application/dtos/savingsAccountDTO';
import { TransactionRepository } from 'src/infrastructure/repository/transactionRepository';
import { Transaction } from 'src/domain/entities/entitieTransaction'; 

@Injectable()
export class AccountService {
  constructor(
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => ConcreteAccountFactory))
    private readonly accountFactory: IAccountFactory,
    private readonly accountRepository: AccountRepository,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) { }

  async createAccount(
    customerId: string,
    type: AccountType,
    initialBalance: number = 0,
    interestRate?: number
  ): Promise<CurrentAccountDTO | SavingsAccountDTO> {
    const customer = await this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    const accountNumber = this.generateRandomAccountNumber();

    const newAccount = this.accountFactory.createAccount(
      type,
      accountNumber,
      initialBalance,
      customer,
      { interestRate, overdraftLimit: 100 }
    ) as CurrentAccount | SavingsAccount;

    customer.accounts.push(newAccount);
    await this.customerService.updateCustomer(customer);
    await this.accountRepository.save(newAccount);

    if (newAccount instanceof CurrentAccount) {
      return new CurrentAccountDTO(newAccount);
    } else if (newAccount instanceof SavingsAccount) {
      return new SavingsAccountDTO(newAccount);
    } else {
      throw new Error('Unexpected account type.');
    }
  }

  async closeAccount(accountNumber: string): Promise<boolean> {
    const account = await this.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    const customer = account.customer;
    customer.accounts = customer.accounts.filter(a => a.accountNumber !== accountNumber);
    await this.customerService.updateCustomer(customer);


    return await this.accountRepository.delete(account.id);
  }

  async deposit(accountNumber: string, amount: number): Promise<void> {
    const account = await this.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero.');
    }

    account.balance += amount;
    await this.accountRepository.save(account);

    await this.transactionService.createTransaction(
      'WITHDRAWAL',  
      +amount,      
      account.balance, 
      account.id      
    );
  }

  async changeAccountType(accountNumber: string, newType: AccountType, interestRate?: number): Promise<CurrentAccountDTO | SavingsAccountDTO> {
    const account = await this.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    const customer = account.customer;

    customer.accounts = customer.accounts.filter(acc => acc.accountNumber !== accountNumber);
    await this.customerService.updateCustomer(customer);

    await this.accountRepository.delete(account.id);

    const newAccount = await this.createAccount(customer.id, newType, interestRate, account.balance);

    return newAccount;
  }


  async withdraw(accountNumber: string, amount: number): Promise<boolean> {
    const account = await this.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than zero.');
    }

    if (amount > account.balance) {
      throw new BadRequestException('Withdrawal amount must be less than or equal to the account balance.');
    }

    account.balance -= amount;
    await this.accountRepository.save(account);

    await this.transactionService.createTransaction(
      'WITHDRAWAL',  
      -amount,      
      account.balance, 
      account.id      
    );
    return true;
  }

  async transfer(fromAccountNumber: string, amount: number, toAccountNumber: string): Promise<boolean> {
    const fromAccount = await this.findAccountByNumber(fromAccountNumber);
    const toAccount = await this.findAccountByNumber(toAccountNumber);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('Accounts not found.');
    }

    if (await this.withdraw(fromAccountNumber, amount)) {
      await this.deposit(toAccountNumber, amount);

      await this.transactionService.createTransaction(
        'TRANSFER', 
        -amount,    
        fromAccount.balance, 
        fromAccount.id      
      );
  
      await this.transactionService.createTransaction(
        'TRANSFER',  
        amount,     
        toAccount.balance,
        toAccount.id      
      );
  

      return true;
    }
    return false;
  }

  async findAccountByNumber(accountNumber: string): Promise<Account | null> {
    const account = await this.accountRepository.findByAccountNumber(accountNumber);

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return account;
  }

  async findAllAccounts(): Promise<Account[]> {
    return this.accountRepository.findAll();
  }

  generateRandomAccountNumber(): string {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `ACC-${randomNumber}`;
  }
}
