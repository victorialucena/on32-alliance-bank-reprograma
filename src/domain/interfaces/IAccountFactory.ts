import { Customer } from "src/domain/entities/entitieCustomer";
import { Account } from "src/domain/entities/entitieAccount";
import { AccountType } from "src/domain/enums/enumAccountType";

export interface IAccountFactory {
  createAccount(
    type: AccountType,
    accountNumber: string,
    balance: number,
    customer: Customer,
    additionalData?: any
  ): Account;
}