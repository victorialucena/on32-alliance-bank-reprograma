import { Injectable } from '@nestjs/common';
import { Conta } from '../models/modelConta';
import { Cliente } from '../models/modelCliente';

@Injectable()
export class ContaService   {
 private contas: Conta[] = [];

 createConta(type: string, numeroConta: string, cliente: Cliente): Conta {
   const newConta = new Conta(type, numeroConta, cliente);
   this.contas.push(newConta);
   return newConta;
 }

 depositar(conta: Conta, valor: number): void {
   conta.saldo += valor;
 }

 sacar(conta: Conta, valor: number): boolean {
   if (valor <= conta.saldo) {
     conta.saldo -= valor;
     return true;
   }
   return false;
 }

 transferir(contaOrigem: Conta, valor: number, contaDestino: Conta): boolean {
   if (this.sacar(contaOrigem, valor)) {
     this.depositar(contaDestino, valor);
     return true;
   }
   return false;
 }

 findContaByNumero(numeroConta: string): Conta {
   return this.contas.find(conta => conta.numeroConta === numeroConta);
 }

 findAllContas(): Conta[] {
   return this.contas;
 }
}
