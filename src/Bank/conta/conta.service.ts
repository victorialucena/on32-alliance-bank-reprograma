import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ContaCorrente } from './models/modelContaCorrente';
import { ContaPoupanca } from './models/modelContaPoupanca';
import { Cliente } from '../cliente/model/modelCliente';

@Injectable()
export class ContaService {
  private contas: (ContaCorrente | ContaPoupanca)[] = [];

  createContaCorrente(numeroConta: string, cliente: Cliente): ContaCorrente | null {
    if (cliente.salaryIncome >= 500) {
      const newConta = new ContaCorrente(numeroConta, 0, cliente); // saldo inicial zero
      this.contas.push(newConta);
      return newConta;
    } else {
      throw new BadRequestException('O cliente não atende aos requisitos mínimos para abrir uma conta corrente.');
    }
  }

  createContaPoupanca(numeroConta: string, cliente: Cliente, taxaDeJuros: number): ContaPoupanca | null {
    const newConta = new ContaPoupanca(numeroConta, 0, cliente, taxaDeJuros); // saldo inicial zero
    this.contas.push(newConta);
    return newConta;
  }

  depositar(conta: ContaCorrente | ContaPoupanca, valor: number): void {
    conta.depositar(valor);
  }

  sacar(conta: ContaCorrente | ContaPoupanca, valor: number): boolean {
    if (valor <= conta.saldo) {
      conta.saldo -= valor;
      return true; 
    }
    return false; 
  }
  

  transferir(contaOrigem: ContaCorrente | ContaPoupanca, valor: number, contaDestino: ContaCorrente | ContaPoupanca): boolean {
    if (this.sacar(contaOrigem, valor)) {
      this.depositar(contaDestino, valor);
      return true;
    }
    return false;
  }

  findContaByNumero(numeroConta: string): ContaCorrente | ContaPoupanca | undefined {
    return this.contas.find(conta => conta.numeroConta === numeroConta);
  }

  findAllContas(): (ContaCorrente | ContaPoupanca)[] {
    return this.contas;
  }
}
