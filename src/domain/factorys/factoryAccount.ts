import { Injectable } from '@nestjs/common';
import { Customer } from 'src/domain/entities/entitieCustomer';
import { Account } from 'src/domain/entities/entitieAccount';
import { CurrentAccount } from 'src/domain/entities/entiteCurrentAccount';
import { SavingsAccount } from 'src/domain/entities/entitieSavingsAccount';
import { AccountType } from 'src/domain/enums/enumAccountType';
import { IAccountFactory } from 'src/domain/interfaces/IAccountFactory';


@Injectable()
export class ConcreteAccountFactory implements IAccountFactory {
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
