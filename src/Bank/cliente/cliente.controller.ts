import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ContaPoupanca } from '../conta/models/modelContaPoupanca';
import { ContaCorrente } from '../conta/models/modelContaCorrente';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  createCliente(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('salaryIncome') salaryIncome: number,
    @Body('gerente') gerente: any, // Supondo que o gerente seja passado no corpo da requisição
  ) {
    const newCliente = this.clienteService.createCliente(name, address, phone, salaryIncome, gerente);
    return {
      message: 'Cliente criado com sucesso.',
      data: newCliente,
    };
  }

  @Patch(':clienteId/conta')
  abrirConta(
    @Param('clienteId') clienteId: string,
    @Body('tipoConta') tipoConta: string,
  ): ContaCorrente | ContaPoupanca | null {
    const conta = this.clienteService.abrirConta(clienteId, tipoConta);
    return conta;
  }

  @Patch(':clienteId/conta/:contaId')
  fecharConta(
    @Param('clienteId') clienteId: string,
    @Param('contaId') contaId: string,
  ) {
    this.clienteService.fecharConta(clienteId, contaId);
    return {
      message: 'Conta fechada com sucesso.',
    };
  }

  @Patch(':clienteId/conta/:contaId/tipo')
  mudarTipoConta(
    @Param('clienteId') clienteId: string,
    @Param('contaId') contaId: string,
    @Body('novoTipo') novoTipo: string,
  ) {
    this.clienteService.mudarTipoConta(clienteId, contaId, novoTipo);
    return {
      message: `Tipo da conta alterado para ${novoTipo}.`,
    };
  }
}
