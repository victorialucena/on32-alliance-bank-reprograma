import { CurrentAccount } from "src/domain/entities/entiteCurrentAccount";

export class CurrentAccountDTO {
 id: string;
 type: string;
 accountNumber: string;
 balance: number;
 overdraftLimit: number = 100;

 constructor(currentAccount: CurrentAccount) {
   this.id = currentAccount.id;
   this.type = currentAccount.type;
   this.accountNumber = currentAccount.accountNumber;
   this.balance = currentAccount.balance;
   this.overdraftLimit = currentAccount.overdraftLimit;
 }
}