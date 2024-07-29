import { Controller, Get, Param, Post, Body, BadRequestException, NotFoundException, Patch, Delete, ForbiddenException, Put, HttpStatus } from '@nestjs/common';
import { CustomerService } from 'src/services/customerService';
import { Customer, CustomerDTO } from '../models/modelCustomer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('createCustomer')
  createCustomer(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('salaryIncome') salaryIncome: number,
    @Body('manager') managerId?: string,
  ) {
    const customer = this.customerService.createCustomer(name, address, phone, salaryIncome, managerId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Customer created successfully',
      data: customer,
    };
  }

  @Patch(':idCustomer/changeAccountType')
  changeAccountType(
    @Param('idCustomer') idCustomer: string,
    @Body('accountNumber') accountNumber: string,
    @Body('newType') newType: 'CURRENT' | 'SAVINGS',
    @Body('interestRate') interestRate?: number
  ) {
    const newAccount = this.customerService.changeAccountType(idCustomer, accountNumber, newType, interestRate);
    if (!newAccount) {
      throw new NotFoundException('Error changing account type.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Account type changed successfully',
      data: newAccount,
    };
  }

  @Delete(':idCustomer/closeAccount')
  closeAccount(
    @Param('idCustomer') idCustomer: string,
    @Body('accountNumber') accountNumber: string
  ) {
    const closedAccount = this.customerService.closeAccount(idCustomer, accountNumber);
    if (!closedAccount) {
      throw new NotFoundException('Error closing account.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Account closed successfully',
      data: null,
    };
  }

  @Get()
  async getAllCustomers() {
    const customers = await this.customerService.getAllCustomers();
    return {
      statusCode: HttpStatus.OK,
      message: 'All customers retrieved successfully',
      data: customers.map(customer => new CustomerDTO(customer)),
    };
  }

  @Get(':idCustomer')
  findCustomerById(@Param('idCustomer') idCustomer: string) {
    const customer = this.customerService.findCustomerById(idCustomer);
    return {
      statusCode: HttpStatus.OK,
      message: 'Customer retrieved successfully',
      data: customer,
    };
  }

  @Post(':idCustomer/createAccount')
  async openAccountForCustomer(
    @Param('idCustomer') idCustomer: string,
    @Body('interestRate') interestRate?: number,
    @Body('type') type?: 'CURRENT' | 'SAVINGS'
  ) {
    try {
      const account = await this.customerService.openAccountForCustomer(idCustomer, type, interestRate);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Account opened successfully',
        data: account,
      };
    } catch (error) {
      throw new BadRequestException('Error opening account.');
    }
  }

  @Post(':customerId/account/deposit')
  async depositIntoAccount(
    @Param('customerId') customerId: string,
    @Body('accountNumber') accountNumber: string,
    @Body('amount') amount: number,
  ) {
    try {
      const result = await this.customerService.depositIntoAccount(customerId, accountNumber, amount);
      return {
        statusCode: HttpStatus.OK,
        message: 'Deposit made successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Error depositing into account.');
    }
  }

  @Put(':idCustomer/account/transfer')
  async transferBetweenAccounts(
    @Param('idCustomer') idCustomer: string,
    @Body('accountNumberFrom') accountNumberFrom: string,
    @Body('accountNumberTo') accountNumberTo: string,
    @Body('value') value: number,
  ) {
    try {
      const result = await this.customerService.transferBetweenAccounts(idCustomer, accountNumberFrom, accountNumberTo, value);
      return {
        statusCode: HttpStatus.OK,
        message: 'Transfer made successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Error transferring between accounts.');
    }
  }

  @Put(':idCustomer/account/withdraw')
  async withdrawFromAccount(
    @Param('idCustomer') idCustomer: string,
    @Body('accountNumber') accountNumber: string,
    @Body('value') value: number,
  ) {
    try {
      const result = await this.customerService.withdrawFromAccount(idCustomer, accountNumber, value);
      return {
        statusCode: HttpStatus.OK,
        message: 'Withdrawal made successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException('Error withdrawing from account.');
    }
  }
}
