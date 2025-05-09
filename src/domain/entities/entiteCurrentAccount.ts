import { Account } from "./entitieAccount";
import { Customer } from "src/domain/entities/entitieCustomer";
import { AccountType } from "src/domain/enums/enumAccountType";
import { Column } from "typeorm";


export class CurrentAccount extends Account {
  @Column()
  overdraftLimit: number = 100;

  constructor(accountNumber: string, balance: number, customer: Customer, overdraftLimit: number = 100) {
    super(AccountType.CURRENT, accountNumber, balance, customer);
    this.overdraftLimit = overdraftLimit;
  }
}
