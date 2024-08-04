import { Customer } from "src/entities/entitieCustomer";
import { Account } from "src/entities/entitieAccount";
import { AccountType } from "src/enums/enumAccountType";

export interface AccountFactory {
  createAccount(
    type: AccountType,
    accountNumber: string,
    balance: number,
    customer: Customer,
    additionalData?: any
  ): Account;
}