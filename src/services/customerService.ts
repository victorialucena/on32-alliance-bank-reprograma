import { v4 as uuidv4 } from 'uuid';
import { Customer, CustomerDTO } from 'src/entities/entitieCustomer';
import { CurrentAccount, CurrentAccountDTO } from '../entities/entiteCurrentAccount';
import { SavingsAccount, SavingsAccountDTO } from '../entities/entitieSavingsAccount';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AccountService } from './accountService';
import { CustomerRepository } from 'src/repository/customerRepository';
import { find } from 'rxjs';
import { error } from 'console';
import { AccountType } from 'src/enums/enumAccountType';
import { Account } from 'src/entities/entitieAccount';

@Injectable()
export class CustomerService {
  private clients: Customer[] = [];

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly customerRepository: CustomerRepository
  ) { }


  async createCustomer(createCustomerDto: CustomerDTO) {
    const { name, address, phone, salaryIncome, managerId } = createCustomerDto;

    const newCustomer = new Customer(name, address, phone, salaryIncome, managerId);
    return await this.customerRepository.save(newCustomer);
  }


  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found!')
    }
    return customer;
  }

  async updateCustomer(customer: Customer): Promise<Customer> {

    const findCustomer = await this.findCustomerById(customer.id);

    if (!findCustomer) {
      throw new Error('Customer not found!')
    }

    return await this.customerRepository.save(findCustomer);;
  }

  async openAccountForCustomer(
    clientId: string,
    type: AccountType,
    interestRate?: number
  ): Promise<CurrentAccountDTO | SavingsAccountDTO> {
    const accountDTO = await this.accountService.createAccount(clientId, type, 0, interestRate);

    const client = await this.findCustomerById(clientId);
    if (client) {
      await this.updateCustomer(client);
    }

    return accountDTO;
  }


  async changeAccountType(clientId: string, accountNumber: string, newType: AccountType, interestRate?: number) {
    const newAccount = await this.accountService.changeAccountType(accountNumber, newType, interestRate);

    const client = await this.findCustomerById(clientId);
    if (client) {
      await this.updateCustomer(client);
    }

    return newAccount;
  }


  async closeAccount(clientId: string, accountNumber: string): Promise<boolean> {
    const client = await this.findCustomerById(clientId);
    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    const account = client.accounts.find(account => account.accountNumber === accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found for the client.');
    }

    const accountClosed = await this.accountService.closeAccount(accountNumber);

    if (accountClosed) {
      client.accounts = client.accounts.filter(account => account.accountNumber !== accountNumber);
      await this.updateCustomer(client);
    }

    return accountClosed;
  }


  async findAccountByNumber(accountNumber: string): Promise<Account> {
    return await this.accountService.findAccountByNumber(accountNumber);
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
