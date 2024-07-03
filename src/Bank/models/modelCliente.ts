import { Conta } from "./modelConta";
import { v4 as uuidv4  } from "uuid";


export class Cliente {
 id: string;
 name: string;
 address: string;
 phone: string;
 salaryIncome: number;
 contas: Conta[];

 constructor(name: string, address: string, phone: string, salaryIncome: number) {
   this.id = uuidv4();
   this.name = name;
   this.address = address;
   this.phone = phone;
   this.salaryIncome = salaryIncome;
   this.contas = [];
 }
}