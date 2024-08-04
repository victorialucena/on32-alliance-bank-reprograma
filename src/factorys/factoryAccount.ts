import { Injectable } from '@nestjs/common';
import { Customer } from 'src/entities/entitieCustomer';
import { Account } from 'src/entities/entitieAccount';
import { CurrentAccount } from 'src/entities/entiteCurrentAccount';
import { SavingsAccount } from 'src/entities/entitieSavingsAccount';
import { AccountType } from 'src/enums/enumAccountType';
import { AccountFactory } from 'src/interfaces/IAccountFactory';


@Injectable()
export class ConcreteAccountFactory implements AccountFactory {
  createAccount(
    type: AccountType,
    accountNumber: string,
    balance: number,
    customer: Customer,
    additionalData?: any
  ): Account {
    switch (type) {
      case AccountType.CURRENT:
        return new CurrentAccount(accountNumber, balance, customer, additionalData?.overdraftLimit || 100);

      case AccountType.SAVINGS:
        if (additionalData?.interestRate === undefined) {
          throw new Error('Interest rate must be provided for a savings account.');
        }
        return new SavingsAccount(accountNumber, balance, customer, additionalData.interestRate);

      default:
        throw new Error('Invalid account type.');
    }
  }
}
