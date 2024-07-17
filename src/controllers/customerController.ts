import { Controller, Get, Param, Post, Body, BadRequestException, NotFoundException, Patch, Delete, ForbiddenException, Put, HttpStatus } from '@nestjs/common';
import { CustomerService } from 'src/services/customerService';
import { Customer, CustomerDTO } from '../models/modelCustomer';
import { Manager } from '../models/modelManager';
import { CurrentAccountDTO } from 'src/models/modelCurrentAccount';
import { SavingsAccountDTO } from 'src/models/modelSavingsAccount';

@Controller('clientes')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('criar')
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
      message: 'Cliente criado com sucesso',
      data: customer,
    };
  }

  @Patch(':idCliente/mudar-tipo-conta/:numeroConta')
  changeAccountType(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string,
    @Body('newType') newType: 'CURRENT' | 'SAVINGS',
    @Body('interestRate') interestRate?: number
  ) {
    const newAccount = this.customerService.changeAccountType(idCliente, numeroConta, newType, interestRate);
    if (!newAccount) {
      throw new NotFoundException('Erro ao mudar o tipo de conta.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Tipo de conta mudado com sucesso',
      data: newAccount,
    };
  }

  @Delete(':idCliente/fechar-conta/:numeroConta')
  closeAccount(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string
  ) {
    const closedAccount = this.customerService.closeAccount(idCliente, numeroConta);
    if (!closedAccount) {
      throw new NotFoundException('Erro ao fechar a conta.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Conta fechada com sucesso',
      data: null,
    };
  }

  @Get()
  async getAllCustomers() {
    const customers = await this.customerService.getAllCustomers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todos os clientes retornados com sucesso',
      data: customers.map(customer => new CustomerDTO(customer)),
    };
  }

  @Get(':id')
  findCustomerById(@Param('id') id: string) {
    const customer = this.customerService.findCustomerById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cliente retornado com sucesso',
      data: customer,
    };
  }

  @Post(':idCliente/contas/:tipo')
  async openAccountForCustomer(
    @Param('idCliente') idCliente: string,
    @Param('tipo') tipo: 'CURRENT' | 'SAVINGS',
    @Body('interestRate') interestRate?: number,
  ) {
    try {
      const account = await this.customerService.openAccountForCustomer(idCliente, tipo, interestRate);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Conta aberta com sucesso',
        data: account,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao abrir conta.');
    }
  }

  @Post(':customerId/contas/:accountNumber/depositar')
  async depositIntoAccount(
    @Param('customerId') customerId: string,
    @Param('accountNumber') accountNumber: string,
    @Body('amount') amount: number,
  ) {
    try {
      const result = await this.customerService.depositIntoAccount(customerId, accountNumber, amount);
      return {
        statusCode: HttpStatus.OK,
        message: 'Depósito realizado com sucesso',
        data: result,
      };
    } catch (error) {
      throw new Error('Erro ao depositar na conta.');
    }
  }

  @Put('transferir')
  async transferBetweenAccounts(
    @Body('customerId') customerId: string,
    @Body('accountNumberFrom') accountNumberFrom: string,
    @Body('accountNumberTo') accountNumberTo: string,
    @Body('value') value: number,
  ) {
    try {
      const result = await this.customerService.transferBetweenAccounts(customerId, accountNumberFrom, accountNumberTo, value);
      return {
        statusCode: HttpStatus.OK,
        message: 'Transferência realizada com sucesso',
        data: result,
      };
    } catch (error) {
      throw new Error('Erro ao transferir entre contas.');
    }
  }

  @Put('sacar/:accountNumber')
  async withdrawFromAccount(
    @Param('accountNumber') accountNumber: string,
    @Body('customerId') customerId: string,
    @Body('value') value: number,
  ) {
    try {
      const result = await this.customerService.withdrawFromAccount(customerId, accountNumber, value);
      return {
        statusCode: HttpStatus.OK,
        message: 'Saque realizado com sucesso',
        data: result,
      };
    } catch (error) {
      throw new Error('Erro ao sacar da conta.');
    }
  }
}
