import { Controller, Post, Body, Param, Patch, Get, Delete, NotFoundException, HttpStatus } from '@nestjs/common';
import { ManagerService } from '../services/managerService';
import { ManagerDTO } from '../models/modelManager';
import { CurrentAccountDTO } from 'src/models/modelCurrentAccount';
import { SavingsAccountDTO } from 'src/models/modelSavingsAccount';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('createManager')
  createManager(
    @Body('name') name: string,
  ) {
    const newManager = this.managerService.createManager(name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Manager created successfully.',
      data: new ManagerDTO(newManager),
    };
  }

  @Get(':managerId')
  getManagerById(
    @Param('managerId') managerId: string,
  ) {
    const manager = this.managerService.findManagerById(managerId);
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found.`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Manager retrieved successfully.',
      data: new ManagerDTO(manager),
    };
  }

  @Patch(':managerId/customer')
  associateCustomer(
    @Param('managerId') managerId: string,
    @Body() body: { customerId: string },
  ) {
    this.managerService.associateCustomer(managerId, body.customerId);
    return {
      statusCode: HttpStatus.OK,
      message: `Customer with ID ${body.customerId} associated with manager ${managerId} successfully.`,
    };
  }

  @Patch(':managerId/customer/:customerId/remove')
  removeCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
  ) {
    this.managerService.removeCustomer(managerId, customerId);
    return {
      statusCode: HttpStatus.OK,
      message: `Customer with ID ${customerId} removed from manager ${managerId} successfully.`,
    };
  }

  @Get()
  async getAllManagers() {
    const managers = await this.managerService.getAllManagers();
    return {
      statusCode: HttpStatus.OK,
      message: 'All managers retrieved successfully.',
      data: managers.map(manager => new ManagerDTO(manager)),
    };
  }

  @Delete(':managerId')
  deleteManager(
    @Param('managerId') managerId: string,
  ) {
    this.managerService.deleteManager(managerId);
    return {
      statusCode: HttpStatus.OK,
      message: `Manager with ID ${managerId} deleted successfully.`,
    };
  }

  @Post(':managerId/customer/:customerId/createAccount')
  createAccountForCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Body() body: { type: 'CURRENT' | 'SAVINGS', interestRate?: number, balance: number },
  ): CurrentAccountDTO | SavingsAccountDTO {
    const { type, interestRate, balance } = body;
    return this.managerService.createAccountForCustomer(managerId, customerId, type, interestRate, balance);
  }

  @Patch(':managerId/customer/:customerId/changeAccount')
  changeAccountTypeForCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Body() body: { accountNumber: string, newType: 'CURRENT' | 'SAVINGS', interestRate?: number },
  ): CurrentAccountDTO | SavingsAccountDTO {
    const { accountNumber, newType, interestRate } = body;
    return this.managerService.changeAccountTypeForCustomer(managerId, customerId, accountNumber, newType, interestRate);
  }

  @Delete(':managerId/customer/:customerId/close-account/:accountNumber')
  closeAccountForCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Param('accountNumber') accountNumber: string
  ): { message: string } {
    const accountClosed = this.managerService.closeAccountForCustomer(managerId, customerId, accountNumber);
    if (!accountClosed) {
      throw new NotFoundException('Error closing account.');
    }
    return { message: 'Account closed successfully.' };
  }
}
