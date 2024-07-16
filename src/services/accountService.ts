import { BadRequestException, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CurrentAccount, CurrentAccountDTO } from '../models/modelCurrentAccount';
import { SavingsAccount, SavingsAccountDTO } from '../models/modelSavingsAccount';
import { CustomerService } from './customerService';
import { Inject } from '@nestjs/common';
import { Account } from 'src/models/modelAccount';
import { Customer } from 'src/models/modelCustomer';

@Injectable()
export class AccountService {
  private accounts: (CurrentAccount | SavingsAccount)[] = [];

  constructor(
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

  createAccount(customerId: string, type: 'CURRENT' | 'SAVINGS', interestRate?: number, initialBalance: number = 0): CurrentAccountDTO | SavingsAccountDTO {
    const customer = this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }
  
    let newAccount: CurrentAccount | SavingsAccount;
  
    if (type === 'CURRENT') {
      if (customer.salaryIncome >= 500) {
        const accountNumber = this.generateRandomAccountNumber();
        const currentAccountNumber = `CA-${accountNumber}`
        newAccount = new CurrentAccount(currentAccountNumber, initialBalance, customer);
      } else {
        throw new BadRequestException('The customer does not meet the minimum requirements to open a current account.');
      }
    } else if (type === 'SAVINGS') {
      if (typeof interestRate !== 'number') {
        throw new BadRequestException('Interest rate must be provided for a savings account.');
      }
      const accountNumber = this.generateRandomAccountNumber();
      const savingsAccountNumber = `SA-${accountNumber}`
      newAccount = new SavingsAccount(savingsAccountNumber, initialBalance, customer, interestRate);
    } else {
      throw new BadRequestException('Invalid account type.');
    }

    this.accounts.push(newAccount);
    customer.accounts.push(newAccount);
    this.customerService.updateCustomer(customer);

    if (newAccount instanceof CurrentAccount) {
      return new CurrentAccountDTO(newAccount);
    } else if (newAccount instanceof SavingsAccount) {
      return new SavingsAccountDTO(newAccount);
    }
  }

  changeAccountType(accountNumber: string, newType: 'CURRENT' | 'SAVINGS', interestRate?: number): CurrentAccountDTO | SavingsAccountDTO {
    const accountIndex = this.accounts.findIndex(account => account.accountNumber === accountNumber);
    if (accountIndex === -1) {
      throw new NotFoundException('Account not found.');
    }

    const currentAccount = this.accounts[accountIndex];
    const customer = currentAccount.customer;

    this.accounts.splice(accountIndex, 1);
    const customerAccountIndex = customer.accounts.findIndex(account => account.accountNumber === accountNumber);
    customer.accounts.splice(customerAccountIndex, 1);
    this.customerService.updateCustomer(customer);

    return this.createAccount(customer.id, newType, interestRate, currentAccount.balance);
  }

  closeAccount(accountNumber: string): boolean {
    const accountIndex = this.accounts.findIndex(account => account.accountNumber === accountNumber);
    if (accountIndex === -1) {
      throw new NotFoundException('Account not found.');
    }
    const account = this.accounts[accountIndex];
    const customer = account.customer;
    customer.accounts = customer.accounts.filter(a => a.accountNumber !== accountNumber);
    this.customerService.updateCustomer(customer);
    this.accounts.splice(accountIndex, 1);
    return true;
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
      return true;
    }
    return false;
  }

  findAccountByNumber(accountNumber: string): CurrentAccount | SavingsAccount | undefined {
    return this.accounts.find(account => account.accountNumber === accountNumber);
  }

  async findAllAccounts(): Promise<Account[]> {
    return this.accounts;
  }

  generateRandomAccountNumber(): string {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const accountNumber = `${randomNumber}`;
    return accountNumber;
  }
}
