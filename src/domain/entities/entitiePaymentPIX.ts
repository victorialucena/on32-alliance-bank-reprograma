import { Entity } from 'typeorm';
import { PaymentType } from "src/domain/enums/enumPaymentType";
import { Payment } from './entitiePayment';

@Entity()
export class PaymentPix extends Payment {
  constructor(amountPayment: number, paymentReference: string) {
    super(amountPayment, paymentReference, PaymentType.PIX);
  }

  pay(amountPayment: number, paymentReference: string): void {
  }
}
