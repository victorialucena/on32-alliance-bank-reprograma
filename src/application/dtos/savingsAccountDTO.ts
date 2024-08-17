import { SavingsAccount } from "src/domain/entities/entitieSavingsAccount";
import { AccountDTOO } from "./accountDTO";

export class SavingsAccountDTO extends AccountDTOO {
 interestRate: number;

 constructor(savingsAccount: SavingsAccount) {
  super(savingsAccount);
  this.interestRate = savingsAccount.interestRate;
 }

 calculateInterestRate(): number {
  return this.balance * (this.interestRate / 100);
 }
}
