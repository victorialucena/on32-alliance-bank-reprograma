import { Controller, Post, Body, Param, Patch, Get, Delete, NotFoundException, HttpStatus } from '@nestjs/common';
import { GerenteService } from '../services/gerenteService';
import { GerenteDTO } from '../models/modelGerente';

@Controller('gerentes')
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) { }

  @Post('criar')
  createGerente(
    @Body('nome') nome: string,
  ) {
    const newGerente = this.gerenteService.createGerente(nome);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Gerente criado com sucesso.',
      data: new GerenteDTO(newGerente),
    };
  }

  @Get(':gerenteId')
  getGerenteById(
    @Param('gerenteId') gerenteId: string,
  ) {
    const gerente = this.gerenteService.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Gerente retornado com sucesso',
      data: new GerenteDTO(gerente),
    };
  }

  @Patch(':gerenteId/cliente')
  associateCliente(
    @Param('gerenteId') gerenteId: string,
    @Body() body: { clienteId: string },
  ) {
    this.gerenteService.associateCliente(gerenteId, body.clienteId);
    return {
      statusCode: HttpStatus.OK,
      message: `Cliente com ID ${body.clienteId} associado ao gerente ${gerenteId} com sucesso.`,
    };
  }

  @Patch(':gerenteId/cliente/:clienteId/remover')
  removeCliente(
    @Param('gerenteId') gerenteId: string,
    @Param('clienteId') clienteId: string,
  ) {
    this.gerenteService.removeCliente(gerenteId, clienteId);
    return {
      statusCode: HttpStatus.OK,
      message: `Cliente com ID ${clienteId} removido do gerente ${gerenteId} com sucesso.`,
    };
  }

  @Get()
  async getAllGerentes() {
    const gerentes = await this.gerenteService.getAllGerentes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todos os gerentes retornados com sucesso',
      data: gerentes.map(gerente => new GerenteDTO(gerente)),
    };
  }

  @Delete(':gerenteId')
  deleteGerente(
    @Param('gerenteId') gerenteId: string,
  ) {
    this.gerenteService.deleteGerente(gerenteId);
    return {
      statusCode: HttpStatus.OK,
      message: `Gerente com ID ${gerenteId} removido com sucesso.`,
    };
  }
}
