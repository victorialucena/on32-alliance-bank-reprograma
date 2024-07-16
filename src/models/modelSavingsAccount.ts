import { Account } from "./modelAccount";
import { Customer } from "./modelCustomer";
import { AccountDTO } from "./modelAccount";

export class SavingsAccount extends Account {
  interestRate: number;

  constructor(accountNumber: string, balance: number, customer: Customer, interestRate: number) {
    super('SAVINGS', accountNumber, balance, customer);
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
