import { Account } from "./entitieAccount";
import { Customer } from "src/entities/entitieCustomer";
import { AccountType } from "src/enums/enumAccountType";
import { Column } from "typeorm";


export class CurrentAccount extends Account {
  @Column()
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
