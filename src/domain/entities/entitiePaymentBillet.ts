import { Entity } from 'typeorm';
import { PaymentType } from "src/domain/enums/enumPaymentType";
import { Payment } from './entitiePayment';

@Entity()
export class PaymentBillet extends Payment {
  constructor(amountPayment: number, paymentReference: string) {
    super(amountPayment, paymentReference, PaymentType.BILLET);
  }

  pay(amountPayment: number, paymentReference: string): void {
  }
}
