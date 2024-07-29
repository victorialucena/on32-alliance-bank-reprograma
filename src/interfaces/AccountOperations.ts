import { Account } from "src/models/modelAccount";

export interface AccountOperations {
  deposit(amount: number): void;
  checkBalance(): void;
  withdraw(amount: number): void;
  transfer(amount: number, toAccount: Account): void;
}
