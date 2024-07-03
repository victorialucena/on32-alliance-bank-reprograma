import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { HttpStatus } from '@nestjs/common';

@Controller('cliente')
export class ClienteController {
 constructor(private readonly clienteService: ClienteService) { }

 @Post()
 createCliente(
  @Body() body: { nome: string; endereco: string; telefone: string; rendaSalarial: number },
 ) {
  const cliente = this.clienteService.createCliente(
   body.nome,
   body.endereco,
   body.telefone,
   body.rendaSalarial,
  );
  return {
   statusCode: HttpStatus.CREATED,
   message: 'Cliente criado com sucesso',
   data: cliente,
  };
 }

 @Get()
 findAllClientes() {
  const clientes = this.clienteService.findAllClientes();
  return {
   statusCode: HttpStatus.OK,
   message: 'Todos os clientes retornados com sucesso',
   data: clientes,
  };
 }

 @Get(':id')
 findClienteById(@Param('id') id: string) {
  const cliente = this.clienteService.findClienteById(id);
  if (!cliente) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Cliente com ID ${id} não encontrado`,
   };
  }
  return {
   statusCode: HttpStatus.OK,
   message: 'Cliente retornado com sucesso',
   data: cliente,
  };
 }

}
