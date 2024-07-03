import { Cliente } from "./modelCliente";
import { v4 as uuidv4  } from "uuid";

export class Gerente {
 id: string;
 nome: string;
 clientes: Cliente[];


 constructor(nome: string, clientes: Cliente[]){
   this.id = uuidv4();
   this.nome = nome;
   this.clientes = clientes
 }
}