import { Account } from "src/domain/entities/entitieAccount";

export interface IAccountOperations {
  deposit(amount: number): void;
  checkBalance(): void;
  withdraw(amount: number): void;
  transfer(amount: number, toAccount: Account): void;
}
