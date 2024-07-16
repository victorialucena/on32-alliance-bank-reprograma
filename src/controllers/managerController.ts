import { Controller, Post, Body, Param, Patch, Get, Delete, NotFoundException, HttpStatus } from '@nestjs/common';
import { ManagerService } from '../services/managerService';
import { ManagerDTO } from '../models/modelManager';

@Controller('gerentes')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) { }

  @Post('criar')
  createManager(
    @Body('name') name: string,
  ) {
    const newManager = this.managerService.createManager(name);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Gerente criado com sucesso.',
      data: new ManagerDTO(newManager),
    };
  }

  @Get(':managerId')
  getManagerById(
    @Param('managerId') managerId: string,
  ) {
    const manager = this.managerService.findManagerById(managerId);
    if (!manager) {
      throw new Error(`Gerente com ID ${managerId} não encontrado.`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Gerente retornado com sucesso',
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
      message: `Cliente com ID ${body.customerId} associado ao gerente ${managerId} com sucesso.`,
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
      message: `Cliente com ID ${customerId} removido do gerente ${managerId} com sucesso.`,
    };
  }

  @Get()
  async getAllManagers() {
    const managers = await this.managerService.getAllManagers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todos os gerentes retornados com sucesso',
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
      message: `Gerente com ID ${managerId} removido com sucesso.`,
    };
  }
}
