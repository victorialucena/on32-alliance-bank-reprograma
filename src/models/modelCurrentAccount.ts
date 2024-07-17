import { Account } from "./modelAccount";
import { Customer } from "src/models/modelCustomer";
import { AccountDTO } from "./modelAccount";

export class CurrentAccount extends Account {
  overdraftLimit: number = 100;

  constructor(accountNumber: string, balance: number, customer: Customer, overdraftLimit: number = 100) {
    super('CURRENT', accountNumber, balance, customer);
    this.overdraftLimit = overdraftLimit;
  }
}

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
