import { Account } from "./modelAccount";
import { Customer } from "src/models/modelCustomer";
import { AccountDTO } from "./modelAccount";

export class CurrentAccount extends Account {
  overdraftLimit: number;

  constructor(accountNumber: string, balance: number, customer: Customer) {
    super('CURRENT', accountNumber, balance, customer);
  }
}

export class CurrentAccountDTO extends AccountDTO {
  overdraftLimit: number;

  constructor(currentAccount: CurrentAccount) {
    super(currentAccount);
    this.overdraftLimit = 100;
  }
}
