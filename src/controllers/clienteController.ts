import { Controller, Get, Param, Post, Body, BadRequestException, NotFoundException, Patch, Delete } from '@nestjs/common';
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
    @Body('gerente') gerente?: Gerente,
  ): Cliente {
    return this.clienteService.createCliente(name, address, phone, salaryIncome, gerente);
  }

  @Patch(':idCliente/mudar-tipo-conta/:numeroConta')
  mudarTipoDeConta(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string,
    @Body('novoTipo') novoTipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number
  ): ContaCorrenteDTO | ContaPoupancaDTO {
    const contaNova = this.clienteService.mudarTipoDeConta(idCliente, numeroConta, novoTipo, taxaDeJuros);
    if (!contaNova) {
      throw new NotFoundException('Erro ao mudar o tipo de conta.');
    }
    return contaNova;
  }

  @Delete(':idCliente/fechar-conta/:numeroConta')
  fecharConta(
    @Param('idCliente') idCliente: string,
    @Param('numeroConta') numeroConta: string
  ): { message: string } {
    const contaFechada = this.clienteService.fecharConta(idCliente, numeroConta);
    if (!contaFechada) {
      throw new NotFoundException('Erro ao fechar a conta.');
    }
    return { message: 'Conta fechada com sucesso.' };
  }
  
  @Get()
  async getAllClientes(): Promise<ClienteDTO[]> {
    const clientes = await this.clienteService.getAllClientes();
    return clientes.map(cliente => new ClienteDTO(cliente));
  }

  @Get(':id')
  findClienteById(@Param('id') id: string): Cliente | undefined {
    return this.clienteService.findClienteById(id);
  }

  @Post(':idCliente/contas/:tipo')
  async abrirContaParaCliente(
    @Param('idCliente') idCliente: string,
    @Param('tipo') tipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number,
  ) {
    try {
      const conta = await this.clienteService.abrirContaParaCliente(idCliente, tipo, taxaDeJuros);
      return { message: 'Conta aberta com sucesso', conta };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Erro ao abrir conta.');
      }
    }
  }
}


