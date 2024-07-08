import { Injectable } from '@nestjs/common';
import { Gerente } from '../models/modelGerente';
import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../models/modelCliente';
import { ContaCorrente } from '../models/modelContaCorrente';
import { ContaPoupanca } from '../models/modelContaPoupanca';

@Injectable()
export class ClienteService {
  private clientes: Cliente[] = [];

  createCliente(name: string, address: string, phone: string, salaryIncome: number, gerente: Gerente): Cliente {
    const newCliente = new Cliente(name, address, phone, salaryIncome, gerente);
    this.clientes.push(newCliente);
    return newCliente;
  }

  getAllClientes(): Cliente[] {
    return this.clientes
  }

  findClienteById(id: string): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  abrirConta(clienteId: string, tipoConta: string): ContaCorrente | ContaPoupanca | null {
    const cliente = this.findClienteById(clienteId);
    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    let novaConta: ContaCorrente | ContaPoupanca;
    const numeroConta = uuidv4();

    if (tipoConta === 'CORRENTE') {
      if (cliente.salaryIncome >= 500) {
        novaConta = new ContaCorrente(numeroConta, 0, cliente);
      } else {
        throw new Error('O cliente não atende aos requisitos mínimos para abrir uma conta corrente.');
      }
    } else if (tipoConta === 'POUPANCA') {
      novaConta = new ContaPoupanca(numeroConta, 0, cliente, 1.5); // Exemplo de taxa de juros
    } else {
      throw new Error('Tipo de conta inválido.');
    }

    cliente.contas.push(novaConta);
    return novaConta;
  }

  fecharConta(clienteId: string, contaId: string): void {
    const cliente = this.findClienteById(clienteId);
    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    cliente.contas = cliente.contas.filter(conta => conta.id !== contaId);
  }

  mudarTipoConta(clienteId: string, contaId: string, novoTipo: string): void {
    const cliente = this.findClienteById(clienteId);
    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    const conta = cliente.contas.find(conta => conta.id === contaId);
    if (!conta) {
      throw new Error(`Conta com ID ${contaId} não encontrada para o cliente ${cliente.name}`);
    }

    if (conta instanceof ContaCorrente && novoTipo === 'POUPANCA') {
      const { saldo } = conta;
      const novaConta = new ContaPoupanca(conta.numeroConta, saldo, cliente, 1.5); // Exemplo de taxa de juros
      cliente.contas = cliente.contas.filter(c => c.id !== conta.id);
      cliente.contas.push(novaConta);
    } else if (conta instanceof ContaPoupanca && novoTipo === 'CORRENTE') {
      const { saldo } = conta;
      const novaConta = new ContaCorrente(conta.numeroConta, saldo, cliente);
      cliente.contas = cliente.contas.filter(c => c.id !== conta.id);
      cliente.contas.push(novaConta);
    } else {
      throw new Error(`Não foi possível mudar o tipo da conta para ${novoTipo}.`);
    }
  }
}
