import { v4 as uuidv4 } from 'uuid';
import { Customer } from 'src/entities/entitieCustomer';
import { CurrentAccount } from '../entities/modelCurrentAccount';
import { SavingsAccount } from '../entities/modelSavingsAccount';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './accountService';
import { CustomerRepository } from 'src/repository/customerRepository';
import { find } from 'rxjs';

@Injectable()
export class CustomerService {
  private clients: Customer[] = [];

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly customerRepository: CustomerRepository
  ) { }

  async createCustomer(name: string, address: string, phone: string, salaryIncome: number, managerId?: string): Promise <Customer> {
    const newClient = new Customer(name, address, phone, salaryIncome, managerId);
    this.clients.push(newClient);
    return await this.customerRepository.save(newClient);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findCustomerById(id: string): Promise <Customer>  {
    return await this.customerRepository.findById(id);
  }

  async updateCustomer(customer: Customer): Promise <Customer> {

    const findCustomer = await this.findCustomerById(customer.id);

    if (findCustomer) {
      return await this.customerRepository.save(findCustomer);
    }
    return null;
  }



  // openAccountForCustomer(clientId: string, type: 'CURRENT' | 'SAVINGS', interestRate?: number) {
  //   const accountDTO = this.accountService.createAccount(clientId, type, interestRate);
  //   const client = this.findCustomerById(clientId);
  //   if (client) {
  //     this.updateCustomer(client);
  //   }
  //   return accountDTO;
  // }

  // changeAccountType(clientId: string, accountNumber: string, newType: 'CURRENT' | 'SAVINGS', interestRate?: number) {
  //   const newAccount = this.accountService.changeAccountType(accountNumber, newType, interestRate);
  //   const client = this.findCustomerById(clientId);
  //   if (client) {
  //     this.updateCustomer(client);
  //   }
  //   return newAccount;
  // }

  // closeAccount(clientId: string, accountNumber: string): boolean {
  //   const client = this.findCustomerById(clientId);
  //   if (!client) {
  //     throw new NotFoundException('Client not found.');
  //   }

  //   const account = client.accounts.find(account => account.accountNumber === accountNumber);
  //   if (!account) {
  //     throw new NotFoundException('Account not found for the client.');
  //   }

  //   const accountClosed = this.accountService.closeAccount(accountNumber);
  //   if (accountClosed) {
  //     client.accounts = client.accounts.filter(account => account.accountNumber !== accountNumber);
  //     this.updateCustomer(client);
  //   }

  //   return accountClosed;
  // }

  // findAccountByNumber(accountNumber: string): CurrentAccount | SavingsAccount | undefined {
  //   return this.accountService.findAccountByNumber(accountNumber);
  // }

  // async checkAccountOwnership(clientId: string, accountNumber: string): Promise<boolean> {
  //   const account = await this.accountService.findAccountByNumber(accountNumber);
  //   if (!account) {
  //     throw new NotFoundException('Account not found.');
  //   }
  //   return account.customer.id === clientId;
  // }

  // async depositIntoAccount(clientId: string, accountNumber: string, amount: number): Promise<void> {
  //   const isOwner = await this.checkAccountOwnership(clientId, accountNumber);
  //   if (!isOwner) {
  //     throw new ForbiddenException('You do not have permission to perform this operation.');
  //   }

  //   await this.accountService.deposit(accountNumber, amount);
  // }

  // async transferBetweenAccounts(clientId: string, fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<boolean> {
  //   const isOwnerFrom = await this.checkAccountOwnership(clientId, fromAccountNumber);
  //   if (!isOwnerFrom) {
  //     throw new ForbiddenException('You do not have permission to perform this operation on the source account.');
  //   }

  //   const isOwnerTo = await this.checkAccountOwnership(clientId, toAccountNumber);
  //   if (!isOwnerTo) {
  //     throw new ForbiddenException('You do not have permission to perform this operation on the destination account.');
  //   }

  //   return this.accountService.transfer(fromAccountNumber, amount, toAccountNumber);
  // }

  // async withdrawFromAccount(clientId: string, accountNumber: string, amount: number): Promise<boolean> {
  //   const isOwner = await this.checkAccountOwnership(clientId, accountNumber);
  //   if (!isOwner) {
  //     throw new ForbiddenException('You do not have permission to perform this operation.');
  //   }

  //   return this.accountService.withdraw(accountNumber, amount);
  // }

}
