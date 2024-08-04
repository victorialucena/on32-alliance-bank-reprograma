import { Account } from "src/entities/entitieAccount";

export interface AccountOperations {
  deposit(amount: number): void;
  checkBalance(): void;
  withdraw(amount: number): void;
  transfer(amount: number, toAccount: Account): void;
}
