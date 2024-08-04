import { Account } from "./entitieAccount";
import { Customer } from "./entitieCustomer";
import { AccountDTO } from "./entitieAccount";
import { AccountType } from "src/enums/enumAccountType";
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

export class SavingsAccountDTO extends AccountDTO {
  interestRate: number;

  constructor(savingsAccount: SavingsAccount) {
    super(savingsAccount);
    this.interestRate = savingsAccount.interestRate;
  }

  calculateInterestRate(): number {
    return this.balance * (this.interestRate / 100);
  }
}
