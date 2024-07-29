import { v4 as uuidv4 } from "uuid";
import { Customer } from "./modelCustomer";
import { CustomerDTO } from "./modelCustomer";
import { AccountOperations } from "src/interfaces/AccountOperations";
import { AccountType } from "src/enums/enumAccountType";

export class Account implements AccountOperations {
  id: string;
  type: AccountType;
  accountNumber: string;
  balance: number;
  customer: Customer;

  constructor(type: AccountType, accountNumber: string, balance: number, customer: Customer) {
    this.id = uuidv4();
    this.type = type;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.customer = customer;
  }

  deposit(amount: number): void { };
  checkBalance(): void { };
  withdraw(amount: number): void { };
  transfer(amount: number, toAccount: Account): void { };
}

export class AccountDTO implements AccountOperations {
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
