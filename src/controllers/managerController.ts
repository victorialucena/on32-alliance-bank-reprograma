import { Controller, Post, Body, Param, Patch, Get, Delete, NotFoundException, HttpStatus, BadRequestException } from '@nestjs/common';
import { ManagerService } from '../services/managerService';
import { ManagerDTO } from '../entities/entiteManager';
import { CurrentAccountDTO } from 'src/entities/entiteCurrentAccount';
import { SavingsAccountDTO } from 'src/entities/entitieSavingsAccount';
import { AccountType } from 'src/enums/enumAccountType';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }

  @Post('createManager')
  async createManager(
    @Body('name') name: string,
  ) {
    try {
      return await this.managerService.createManager(name);
    } catch (error) {
      throw new BadRequestException({ error: error.message });
    }
  }

  @Get(':managerId')
  getManagerById(
    @Param('managerId') managerId: string,
  ) {
    try {
      return this.managerService.findManagerById(managerId);
    } catch (error) {
      throw new NotFoundException({ error: error.message });
    }
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
  async createAccountForCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Body() body: { type: AccountType, interestRate?: number, balance: number },
  ): Promise <CurrentAccountDTO | SavingsAccountDTO> {
    const { type, interestRate, balance } = body;
    try{
      return await this.managerService.createAccountForCustomer(managerId, customerId, type, interestRate, balance);
    } catch(error){
      throw new BadRequestException({ error: error.message });
    }
  }

  @Patch(':managerId/customer/:customerId/changeAccount')
   async changeAccountTypeForCustomer(
    @Param('managerId') managerId: string,
    @Param('customerId') customerId: string,
    @Body() body: { accountNumber: string, newType: AccountType, interestRate?: number },
  ): Promise <CurrentAccountDTO | SavingsAccountDTO> {
    const { accountNumber, newType, interestRate } = body;
    try{
      return await this.managerService.changeAccountTypeForCustomer(managerId, customerId, accountNumber, newType, interestRate);
    } catch(error) {
      throw new BadRequestException({ error: error.message });
    }
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
