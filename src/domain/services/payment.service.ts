import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AccountService } from './accountService';
import { IPayment } from 'src/domain/interfaces/IPayment';
import { PaymentType } from 'src/domain/enums/enumPaymentType';
import { CurrentAccount } from 'src/domain/entities/entiteCurrentAccount';
import { PaymentBillet } from '../entities/entitiePaymentBillet';
import { PaymentPix } from '../entities/entitiePaymentPIX';
import { Payment } from '../entities/entitiePayment';
import { PaymentRepository } from 'src/infrastructure/repository/paymentRepository';
import { AccountRepository } from 'src/infrastructure/repository/accountRepository';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  private createPaymentInstance(
    type: PaymentType,
    amountPayment: number,
    paymentReference: string,
  ): IPayment {
    switch (type) {
      case PaymentType.PIX:
        return new PaymentPix(amountPayment, paymentReference);
      case PaymentType.BILLET:
        return new PaymentBillet(amountPayment, paymentReference);
      default:
        throw new NotFoundException('Payment type not supported');
    }
  }

  private async processPayment(payment: IPayment, account: CurrentAccount): Promise<Payment> {
    const availableFunds = account.balance + account.overdraftLimit;

    if (availableFunds < payment.amountPayment) {
      throw new NotFoundException('Insufficient balance and overdraft limit.');
    }

    if (account.balance >= payment.amountPayment) {
      account.balance -= payment.amountPayment;
    } else {
      const remainingAmount = payment.amountPayment - account.balance;
      if (remainingAmount > account.overdraftLimit) {
        throw new NotFoundException('Insufficient balance and overdraft limit.');
      }
      account.balance = 0;
      account.overdraftLimit -= remainingAmount;
    }

    return await this.paymentRepository.save(payment);
  }

  async pay(amountPayment: number, paymentReference: string, accountNumber: string, paymentType: PaymentType): Promise<Payment> {
    const account = await this.accountService.findByAccountNumber(accountNumber) as CurrentAccount;
    if (!account) {
      throw new NotFoundException('Account not found or invalid');
    }

    const paymentInstance = this.createPaymentInstance(paymentType, amountPayment, paymentReference);

    return this.processPayment(paymentInstance, account);
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.findAll();
  }
}
