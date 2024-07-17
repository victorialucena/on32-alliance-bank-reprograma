import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AccountService } from './accountService';
import { CustomerService } from './customerService';
import { CurrentAccount } from 'src/models/modelCurrentAccount';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService
  ) {}

  pay(amountPayment: number, paymentReference: string, accountNumber: string) {
    const account = this.accountService.findAccountByNumber(accountNumber) as CurrentAccount;
    if (!account) {
      throw new NotFoundException('Account not found or invalid');
    }

    const availableFunds = account.balance + account.overdraftLimit;

    if (availableFunds < amountPayment) {
      throw new NotFoundException('Insufficient balance and overdraft limit.');
    }

    if (account.balance >= amountPayment) {
      account.balance -= amountPayment;
    } else {
      const remainingAmount = amountPayment - account.balance;

      if (remainingAmount > account.overdraftLimit) {
        throw new NotFoundException('Insufficient balance and overdraft limit.');
      }

      account.balance = 0;
      account.overdraftLimit -= remainingAmount;
    }

    return `Payment of ${amountPayment} successful`;
  }

  payPix(amountPayment: number, paymentReference: string, accountNumber: string) {
    return this.pay(amountPayment, paymentReference, accountNumber);
  }

  payBillet(amountPayment: number, paymentReference: string,  accountNumber: string) {
    return this.pay(amountPayment, paymentReference, accountNumber);
  }
}
