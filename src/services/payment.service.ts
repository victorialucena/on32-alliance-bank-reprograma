import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AccountService } from './accountService';
import { CustomerService } from './customerService';
import { PaymentPix } from 'src/models/modelPaymentPIX';
import { PaymentBillet } from 'src/models/modelPaymentBillet';

@Injectable()
export class PaymentService {
  private payments: (PaymentBillet | PaymentPix);

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService
  ) {}


  private pay(amountPayment: number, paymentReference: string, accountNumber: string) {

    const account = this.accountService.findAccountByNumber(accountNumber);
    if (!account) {
      throw new NotFoundException('Account not found or invalid')
    }

    if (account.balance < amountPayment) {
     throw new NotFoundException('Insufficient balance.');
   }

    account.balance -= amountPayment;
    return `Payment of ${amountPayment} successful`;
  }

  payPix(amountPayment: number, paymentReference: string, accountNumber: string) {
    return this.pay(amountPayment, paymentReference, accountNumber);
  }

  payBillet(amountPayment: number, paymentReference: string,  accountNumber: string) {
    return this.pay(amountPayment, paymentReference, accountNumber);
  }

}
