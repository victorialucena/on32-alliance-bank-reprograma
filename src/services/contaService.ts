import { BadRequestException, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { ClienteService } from './clienteService';
import { Inject } from '@nestjs/common';
import { Conta } from 'src/models/modelConta';


@Injectable()
export class ContaService {
  private contas: (ContaCorrente | ContaPoupanca)[] = [];

  constructor(
    @Inject(forwardRef(() => ClienteService))
    private readonly clienteService: ClienteService,
  ) {}

  createConta(clienteId: string, tipo: 'CORRENTE' | 'POUPANCA', taxaDeJuros?: number): ContaCorrenteDTO | ContaPoupancaDTO {
    const cliente = this.clienteService.findClienteById(clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    let newConta;
    if (tipo === 'CORRENTE') {
      if (cliente.salaryIncome >= 500) {
        const numeroConta = this.generateRandomAccountNumber();
        newConta = new ContaCorrente(numeroConta, 0, cliente);
      } else {
        throw new BadRequestException('O cliente não atende aos requisitos mínimos para abrir uma conta corrente.');
      }
    } else if (tipo === 'POUPANCA') {
      if (typeof taxaDeJuros !== 'number') {
        throw new BadRequestException('A taxa de juros deve ser fornecida para uma conta poupança.');
      }
      const numeroConta = this.generateRandomAccountNumber();
      newConta = new ContaPoupanca(numeroConta, 0, cliente, taxaDeJuros);
    } else {
      throw new BadRequestException('Tipo de conta inválido.');
    }

    this.contas.push(newConta);
    cliente.contas.push(newConta);

    if (newConta instanceof ContaCorrente) {
      return new ContaCorrenteDTO(newConta);
    } else {
      return new ContaPoupancaDTO(newConta);
    }
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

  async findAllContas(): Promise<Conta[]> {
    return this.contas;
  }

  generateRandomAccountNumber(): string {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const numeroConta = `CC-${randomNumber}`;
    return numeroConta;
  }
}
