import { Account } from "./modelAccount";
import { Customer } from "src/models/modelCustomer";
import { AccountType } from "src/enums/enumAccountType";


export class CurrentAccount extends Account {
  overdraftLimit: number = 100;

  constructor(accountNumber: string, balance: number, customer: Customer, overdraftLimit: number = 100) {
    super(AccountType.CURRENT, accountNumber, balance, customer);
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
