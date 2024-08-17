import { Account } from "./entitieAccount";
import { Customer } from "./entitieCustomer";
import { AccountType } from "src/domain/enums/enumAccountType";
import { Column } from "typeorm";

export class SavingsAccount extends Account {

  @Column()
  interestRate: number;

  constructor(accountNumber: string, balance: number, customer: Customer, interestRate: number) {
    super(AccountType.SAVINGS, accountNumber, balance, customer);
    this.interestRate = interestRate;
  }

  calculateInterestRate(): number {
    return this.balance * (this.interestRate / 100);
  }
}
