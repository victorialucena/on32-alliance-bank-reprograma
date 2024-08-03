import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Manager } from '../entities/entiteManager';
import { CustomerService } from './customerService';
import { AccountService } from './accountService';
import { CurrentAccountDTO } from 'src/entities/modelCurrentAccount';
import { SavingsAccountDTO } from 'src/entities/modelSavingsAccount';
import { ManagerRepository } from 'src/repository/managerRepository';

@Injectable()
export class ManagerService {
  private managers: Manager[] = [];

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly managerRepository: ManagerRepository
  ) { }

  async createManager(name: string): Promise<Manager> {
    const newManager = new Manager(name);
    this.managers.push(newManager);
    return await this.managerRepository.save(newManager);
  }

  async findManagerById(id: string): Promise<Manager> {
    const manager = await this.managerRepository.findById(id);
    if (!manager) {
      throw new Error('User not found');
    }

    return manager;
  }

  // associateCustomer(managerId: string, customerId: string): void {
  //   const manager = this.findManagerById(managerId);
  //   if (!manager) {
  //     throw new Error(`Manager with ID ${managerId} not found.`);
  //   }

  //   const customer = this.customerService.findCustomerById(customerId);
  //   if (!customer) {
  //     throw new Error(`Customer with ID ${customerId} not found.`);
  //   }

  //   customer.managerId = managerId;
  //   manager.customers.push(customer);
  // }

  // removeCustomer(managerId: string, customerId: string): void {
  //   const manager = this.findManagerById(managerId);
  //   if (!manager) {
  //     throw new Error(`Manager with ID ${managerId} not found.`);
  //   }

  //   const customerIndex = manager.customers.findIndex(customer => customer.id === customerId);
  //   if (customerIndex === -1) {
  //     throw new Error(`Customer with ID ${customerId} not found.`);
  //   }

  //   manager.customers[customerIndex].managerId = undefined;
  //   manager.customers.splice(customerIndex, 1);
  // }

  async getAllManagers(): Promise<Manager[]> {
    return await this.managerRepository.findAll();
  }

  // createAccountForCustomer(managerId: string, customerId: string, type: 'CURRENT' | 'SAVINGS', interestRate?: number, initialBalance: number = 0): CurrentAccountDTO | SavingsAccountDTO {
  //   const manager = this.findManagerById(managerId);
  //   if (!manager) {
  //     throw new NotFoundException(`Manager with ID ${managerId} not found.`);
  //   }

  //   const customer = this.customerService.findCustomerById(customerId);
  //   if (!customer) {
  //     throw new NotFoundException(`Customer with ID ${customerId} not found.`);
  //   }

  //   if (customer.managerId !== manager.id) {
  //     throw new BadRequestException('Manager is not authorized to create an account for this customer.');
  //   }

  //   return this.accountService.createAccount(customerId, type, interestRate, initialBalance);
  // }

  // changeAccountTypeForCustomer(managerId: string, customerId: string, accountNumber: string, newType: 'CURRENT' | 'SAVINGS', interestRate?: number) {
  //   const manager = this.findManagerById(managerId);
  //   if (!manager) {
  //     throw new NotFoundException(`Manager with ID ${managerId} not found.`);
  //   }

  //   const customer = this.customerService.findCustomerById(customerId);
  //   if (!customer) {
  //     throw new NotFoundException(`Customer with ID ${customerId} not found.`);
  //   }

  //   if (customer.managerId !== manager.id) {
  //     throw new BadRequestException('Manager is not authorized to change account type for this customer.');
  //   }

  //   return this.accountService.changeAccountType(accountNumber, newType, interestRate);
  // }

  // closeAccountForCustomer(managerId: string, customerId: string, accountNumber: string) {
  //   const manager = this.findManagerById(managerId);
  //   if (!manager) {
  //     throw new NotFoundException(`Manager with ID ${managerId} not found.`);
  //   }

  //   const customer = this.customerService.findCustomerById(customerId);
  //   if (!customer) {
  //     throw new NotFoundException(`Customer with ID ${customerId} not found.`);
  //   }

  //   if (customer.managerId !== manager.id) {
  //     throw new BadRequestException('Manager is not authorized to close account for this customer.');
  //   }

  //   return this.accountService.closeAccount(accountNumber);
  // }

  async deleteManager(id: string): Promise<boolean> {
    return await this.managerRepository.delete(id);
  }
}
