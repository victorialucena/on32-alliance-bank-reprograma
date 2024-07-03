import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { ContaService } from './conta.service';
import { Cliente } from '../models/modelCliente';
import { HttpStatus } from '@nestjs/common';

@Controller('conta')
export class ContaController {
 constructor(private readonly contaService: ContaService) { }

 @Post()
 createConta(
  @Body() body: { type: string; numeroConta: string; cliente: Cliente },
 ) {
  const conta = this.contaService.createConta(body.type, body.numeroConta, body.cliente);
  return {
   statusCode: HttpStatus.CREATED,
   message: 'Conta criada com sucesso',
   data: conta,
  };
 }

 @Get()
 findAllContas() {
  const contas = this.contaService.findAllContas();
  return {
   statusCode: HttpStatus.OK,
   message: 'Todas as contas retornadas com sucesso',
   data: contas,
  };
 }

 @Get(':numeroConta')
 findContaByNumero(@Param('numeroConta') numeroConta: string) {
  const conta = this.contaService.findContaByNumero(numeroConta);
  if (!conta) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Conta ${numeroConta} não encontrada`,
   };
  }
  return {
   statusCode: HttpStatus.OK,
   message: 'Conta retornada com sucesso',
   data: conta,
  };
 }

 @Patch('depositar/:numeroConta')
 depositar(@Param('numeroConta') numeroConta: string, @Body('valor') valor: number) {
  const conta = this.contaService.findContaByNumero(numeroConta);
  if (!conta) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Conta ${numeroConta} não encontrada`,
   };
  }
  this.contaService.depositar(conta, valor);
  return {
   statusCode: HttpStatus.OK,
   message: `Depósito de R$${valor} realizado com sucesso na conta ${numeroConta}`,
  };
 }

 @Patch('sacar/:numeroConta')
 sacar(@Param('numeroConta') numeroConta: string, @Body('valor') valor: number) {
  const conta = this.contaService.findContaByNumero(numeroConta);
  if (!conta) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Conta ${numeroConta} não encontrada`,
   };
  }
  const success = this.contaService.sacar(conta, valor);
  return {
   statusCode: success ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
   message: success
    ? `Saque de R$${valor} realizado com sucesso na conta ${numeroConta}`
    : `Saldo insuficiente na conta ${numeroConta}`,
  };
 }

 @Patch('transferir/:numeroContaOrigem')
 transferir(
  @Param('numeroContaOrigem') numeroContaOrigem: string,
  @Body('valor') valor: number,
  @Body('numeroContaDestino') numeroContaDestino: string,
 ) {
  const contaOrigem = this.contaService.findContaByNumero(numeroContaOrigem);
  const contaDestino = this.contaService.findContaByNumero(numeroContaDestino);
  if (!contaOrigem || !contaDestino) {
   return {
    statusCode: HttpStatus.NOT_FOUND,
    message: `Conta de origem ou destino não encontrada`,
   };
  }
  const success = this.contaService.transferir(contaOrigem, valor, contaDestino);
  return {
   statusCode: success ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
   message: success
    ? `Transferência de R$${valor} realizada com sucesso da conta ${numeroContaOrigem} para a conta ${numeroContaDestino}`
    : `Saldo insuficiente na conta ${numeroContaOrigem}`,
  };
 }
}
