import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Manager } from '../entities/entiteManager';
import { CustomerService } from './customerService';
import { AccountService } from './accountService';
import { ManagerRepository } from 'src/repository/managerRepository';
import { AccountType } from 'src/enums/enumAccountType';
import { CurrentAccountDTO } from 'src/entities/entiteCurrentAccount';
import { SavingsAccountDTO } from 'src/entities/entitieSavingsAccount';

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
      throw new Error('Manager not found');
    }

    return manager;
  }

  async associateCustomer(managerId: string, customerId: string): Promise<void> {
    const manager = await this.findManagerById(managerId);
    if (!manager) {
      throw new Error(`Manager with ID ${managerId} not found.`);
    }
  
    const customer = await this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
  
    customer.managerId = managerId;
  
    await this.customerService.updateCustomer(customer);
  
    manager.customers.push(customer);
  
    await this.managerRepository.save(manager);
  }
  

  async removeCustomer(managerId: string, customerId: string): Promise<void> {
    const manager = await this.findManagerById(managerId);
    if (!manager) {
      throw new Error(`Manager with ID ${managerId} not found.`);
    }
  
    const customerIndex = manager.customers.findIndex(customer => customer.id === customerId);
    if (customerIndex === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }
  
    manager.customers[customerIndex].managerId = undefined;
  
    await this.customerService.updateCustomer(manager.customers[customerIndex]);
  
    manager.customers.splice(customerIndex, 1);
  
    await this.managerRepository.save(manager);
  }
  

  async getAllManagers(): Promise<Manager[]> {
    return await this.managerRepository.findAll();
  }

  async createAccountForCustomer(managerId: string, customerId: string, type: AccountType, interestRate?: number, initialBalance: number = 0):  Promise <CurrentAccountDTO | SavingsAccountDTO>  {
    const manager = await this.findManagerById(managerId);
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found.`);
    }

    const customer = await this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found.`);
    }

    if (customer.managerId !== manager.id) {
      throw new BadRequestException('Manager is not authorized to create an account for this customer.');
    }

    return this.accountService.createAccount(customerId, type, interestRate, initialBalance);
  }

  async changeAccountTypeForCustomer(managerId: string, customerId: string, accountNumber: string, newType: AccountType, interestRate?: number) {
    const manager = await this.findManagerById(managerId);
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found.`);
    }

    const customer = await this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found.`);
    }

    if (customer.managerId !== manager.id) {
      throw new BadRequestException('Manager is not authorized to change account type for this customer.');
    }

    return this.accountService.changeAccountType(accountNumber, newType, interestRate);
  }

  async closeAccountForCustomer(managerId: string, customerId: string, accountNumber: string) {
    const manager = await this.findManagerById(managerId);
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found.`);
    }
  
    const customer = await this.customerService.findCustomerById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found.`);
    }
  
    if (customer.managerId !== manager.id) {
      throw new BadRequestException('Manager is not authorized to close account for this customer.');
    }
  
    return this.accountService.closeAccount(accountNumber);
  }
  

  async deleteManager(id: string): Promise<boolean> {
    const managerDelete = await this.managerRepository.delete(id)

    if (!managerDelete) {
      throw new Error('Manager not found');
    }
    return managerDelete;
  }
}
