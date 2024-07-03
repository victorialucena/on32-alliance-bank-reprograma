import { Cliente } from "./modelCliente";
import { v4 as uuidv4  } from "uuid";


export class Conta {
 id: string;
 type: string;
 numeroConta: string;
 saldo: number;
 cliente: Cliente;

 constructor(type: string, numeroConta: string, cliente: Cliente) {
   this.id = uuidv4();
   this.type = type;
   this.numeroConta = numeroConta;
   this.saldo = 0;
   this.cliente = cliente;
 }
}