import { Controller, Get, Param, Post, Body, BadRequestException, NotFoundException, Patch, Delete, ForbiddenException, Put, HttpStatus } from '@nestjs/common';
import { ClienteService } from 'src/services/clienteService';
import { Cliente, ClienteDTO } from '../models/modelCliente';
import { Gerente } from '../models/modelGerente';
import { ContaCorrenteDTO } from 'src/models/modelContaCorrente';
import { ContaPoupancaDTO } from 'src/models/modelContaPoupanca';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('criar')
  createCliente(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('salaryIncome') salaryIncome: number,
    @Body('gerente') gerenteId?: string,
  ) {
    const cliente = this.clienteService.createCliente(name, address, phone, salaryIncome, gerenteId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cliente criado com sucesso',
      data: cliente,
    };
  }

  @Patch(':idCliente/mudar-tipo-conta/:numeroConta')
  mudarTipoDeConta(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string,
    @Body('novoTipo') novoTipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number
  ) {
    const contaNova = this.clienteService.mudarTipoDeConta(idCliente, numeroConta, novoTipo, taxaDeJuros);
    if (!contaNova) {
      throw new NotFoundException('Erro ao mudar o tipo de conta.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Tipo de conta mudado com sucesso',
      data: contaNova,
    };
  }

  @Delete(':idCliente/fechar-conta/:numeroConta')
  fecharConta(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string
  ) {
    const contaFechada = this.clienteService.fecharConta(idCliente, numeroConta);
    if (!contaFechada) {
      throw new NotFoundException('Erro ao fechar a conta.');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Conta fechada com sucesso',
      data: null,
    };
  }
  
  @Get()
  async getAllClientes() {
    const clientes = await this.clienteService.getAllClientes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todos os clientes retornados com sucesso',
      data: clientes.map(cliente => new ClienteDTO(cliente)),
    };
  }

  @Get(':id')
  findClienteById(@Param('id') id: string) {
    const cliente = this.clienteService.findClienteById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cliente retornado com sucesso',
      data: cliente,
    };
  }

  @Post(':idCliente/contas/:tipo')
  async abrirContaParaCliente(
    @Param('idCliente') idCliente: string,
    @Param('tipo') tipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number,
  ) {
    try {
      const conta = await this.clienteService.abrirContaParaCliente(idCliente, tipo, taxaDeJuros);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Conta aberta com sucesso',
        data: conta,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao abrir conta.');
    }
  }

  @Post(':clienteId/contas/:numeroConta/depositar')
  async depositarEmConta(
    @Param('clienteId') clienteId: string,
    @Param('numeroConta') numeroConta: string,
    @Body('valor') valor: number,
  ) {
    try {
     const resultado =  await this.clienteService.depositarNaConta(clienteId, numeroConta, valor);
      return {
        statusCode: HttpStatus.OK,
        message: 'Depósito realizado com sucesso',
        data: resultado,
      };
    } catch (error) {
      throw new Error('Erro ao depositar na conta.');
    }
  }

  @Put('transferir')
  async transferirEntreContas(
    @Body('clienteId') clienteId: string,
    @Body('numeroContaOrigem') numeroContaOrigem: string,
    @Body('numeroContaDestino') numeroContaDestino: string,
    @Body('valor') valor: number,
  ) {
    try {
      const resultado = await this.clienteService.transferirEntreContas(clienteId, numeroContaOrigem, numeroContaDestino, valor);
      return {
        statusCode: HttpStatus.OK,
        message: 'Transferência realizada com sucesso',
        data: resultado,
      };
    } catch (error) {
      throw new Error('Erro ao transferir entre contas.');
    }
  }

  @Put('sacar/:contaNumero')
  async sacarDaConta(
    @Param('contaNumero') contaNumero: string,
    @Body('clienteId') clienteId: string,
    @Body('valor') valor: number,
  ) {
    try {
      const resultado = await this.clienteService.sacarDaConta(clienteId, contaNumero, valor);
      return {
        statusCode: HttpStatus.OK,
        message: 'Saque realizado com sucesso',
        data: resultado,
      };
    } catch (error) {
      throw new Error('Erro ao sacar da conta.');
    }
  }
}
