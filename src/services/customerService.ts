import { v4 as uuidv4 } from 'uuid';
import { Customer } from 'src/models/modelCustomer';
import { CurrentAccount } from '../models/modelCurrentAccount';
import { SavingsAccount } from '../models/modelSavingsAccount';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './accountService';
import { Manager } from 'src/models/modelManager';

@Injectable()
export class CustomerService {
  private clients: Customer[] = [];

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) { }

  createCustomer(name: string, address: string, phone: string, salaryIncome: number, managerId?: string): Customer {
    const newClient = new Customer(name, address, phone, salaryIncome, managerId);
    this.clients.push(newClient);
    return newClient;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.clients;
  }

  findCustomerById(id: string): Customer | undefined {
    return this.clients.find(client => client.id === id);
  }

  updateCustomer(client: Customer): void {
    const index = this.clients.findIndex(c => c.id === client.id);
    if (index !== -1) {
      this.clients[index] = client;
    }
  }

  openAccountForCustomer(clientId: string, type: 'CURRENT' | 'SAVINGS', interestRate?: number) {
    const accountDTO = this.accountService.createAccount(clientId, type, interestRate);
    const client = this.findCustomerById(clientId);
    if (client) {
      this.updateCustomer(client);
    }
    return accountDTO;
  }

  changeAccountType(clientId: string, accountNumber: string, newType: 'CURRENT' | 'SAVINGS', interestRate?: number) {
    const newAccount = this.accountService.changeAccountType(accountNumber, newType, interestRate);
    const client = this.findCustomerById(clientId);
    if (client) {
      this.updateCustomer(client);
    }
    return newAccount;
  }

  closeAccount(clientId: string, accountNumber: string): boolean {
    const client = this.findCustomerById(clientId);
    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    const account = client.accounts.find(account => account.accountNumber === accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found for the client.');
    }

    const accountClosed = this.accountService.closeAccount(accountNumber);
    if (accountClosed) {
      client.accounts = client.accounts.filter(account => account.accountNumber !== accountNumber);
      this.updateCustomer(client);
    }

    return accountClosed;
  }

  findAccountByNumber(accountNumber: string): CurrentAccount | SavingsAccount | undefined {
    return this.accountService.findAccountByNumber(accountNumber);
  }

  async checkAccountOwnership(clientId: string, accountNumber: string): Promise<boolean> {
    const account = await this.accountService.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found.');
    }
    return account.customer.id === clientId;
  }

  async depositIntoAccount(clientId: string, accountNumber: string, amount: number): Promise<void> {
    const isOwner = await this.checkAccountOwnership(clientId, accountNumber);
    if (!isOwner) {
      throw new ForbiddenException('You do not have permission to perform this operation.');
    }

    await this.accountService.deposit(accountNumber, amount);
  }

  async transferBetweenAccounts(clientId: string, fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<boolean> {
    const isOwnerFrom = await this.checkAccountOwnership(clientId, fromAccountNumber);
    if (!isOwnerFrom) {
      throw new ForbiddenException('You do not have permission to perform this operation on the source account.');
    }

    const isOwnerTo = await this.checkAccountOwnership(clientId, toAccountNumber);
    if (!isOwnerTo) {
      throw new ForbiddenException('You do not have permission to perform this operation on the destination account.');
    }

    return this.accountService.transfer(fromAccountNumber, amount, toAccountNumber);
  }

  async withdrawFromAccount(clientId: string, accountNumber: string, amount: number): Promise<boolean> {
    const isOwner = await this.checkAccountOwnership(clientId, accountNumber);
    if (!isOwner) {
      throw new ForbiddenException('You do not have permission to perform this operation.');
    }

    return this.accountService.withdraw(accountNumber, amount);
  }

}
