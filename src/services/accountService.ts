import { BadRequestException, Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { CurrentAccount, CurrentAccountDTO } from '../entities/entiteCurrentAccount';
import { SavingsAccount, SavingsAccountDTO } from '../entities/entitieSavingsAccount';
import { CustomerService } from './customerService';
import { Account } from 'src/entities/entitieAccount';
import { Customer } from 'src/entities/entitieCustomer';
import { AccountFactory } from 'src/interfaces/IAccountFactory';
import { AccountType } from 'src/enums/enumAccountType';
import { AccountRepository } from 'src/repository/accountRepository';
import { ConcreteAccountFactory } from 'src/factorys/factoryAccount';

@Injectable()
export class AccountService {
  constructor(
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => ConcreteAccountFactory))
    private readonly accountFactory: AccountFactory,
    private readonly accountRepository: AccountRepository
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
      await this.accountRepository.save(fromAccount);
      await this.accountRepository.save(toAccount);
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
