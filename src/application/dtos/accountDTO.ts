import { Account } from "src/domain/entities/entitieAccount";
import { AccountType } from "src/domain/enums/enumAccountType";
import { IAccountOperations } from "src/domain/interfaces/IAccountOperations";
import { CustomerDTO } from "./customerDTO";

export class AccountDTOO implements IAccountOperations {
  id: string;
  type: AccountType;
  accountNumber: string;
  balance: number;
  customer: CustomerDTO;

  constructor(account: Account) {
    this.id = account.id;
    this.type = account.type;
    this.accountNumber = account.accountNumber;
    this.balance = account.balance;
  }

  deposit(amount: number): void { };
  checkBalance(): void { };
  withdraw(amount: number): void { };
  transfer(amount: number, toAccount: Account): void { };
}