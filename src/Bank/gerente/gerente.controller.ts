import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { GerenteService } from './gerente.service';
import { Cliente } from '../models/modelCliente';
import { HttpStatus } from '@nestjs/common';

@Controller('gerente')
export class GerenteController {

 constructor(private readonly gerenteService: GerenteService) { }

 @Post()
 createGerente(
  @Body() body: { nome: string; clientes: Cliente[] },
 ) {
  const gerente = this.gerenteService.createGerente(
   body.nome,
   body.clientes,
  );
  return {
   statusCode: HttpStatus.CREATED,
   message: 'Gerente criado com sucesso',
   data: gerente,
  };
 }

 @Get()
 findAllGerentes() {
  const gerentes = this.gerenteService.findAllGerentes();
  return {
   statusCode: HttpStatus.OK,
   message: 'Todos os gerentes retornados com sucesso',
   data: gerentes,
  };
 }

 @Get(':id')
 findGerenteById(@Param('id') id: string) {
  const gerente = this.gerenteService.findGerenteById(id);
  if (!gerente) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Gerente com ID ${id} não encontrado`,
   };
  }
  return {
   statusCode: HttpStatus.OK,
   message: 'Gerente retornado com sucesso',
   data: gerente,
  };
 }

 @Put(':id/clientes')
 addCliente(
  @Param('id') gerenteId: string,
  @Body() body: { cliente: Cliente },
 ) {
  const gerente = this.gerenteService.addCliente(gerenteId, body.cliente);
  if (!gerente) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Gerente com ID ${gerenteId} não encontrado`,
   };
  }
  return {
   statusCode: HttpStatus.OK,
   message: 'Cliente adicionado ao gerente com sucesso',
   data: gerente,
  };
 }

 @Delete(':id/clientes/:clienteId')
 removeCliente(
  @Param('id') gerenteId: string,
  @Param('clienteId') clienteId: string,
 ) {
  const gerente = this.gerenteService.removeCliente(gerenteId, clienteId);
  if (!gerente) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Gerente com ID ${gerenteId} não encontrado`,
   };
  }
  return {
   statusCode: HttpStatus.OK,
   message: 'Cliente removido do gerente com sucesso',
   data: gerente,
  };
 }
}
