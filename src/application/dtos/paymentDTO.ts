import { Payment } from "src/domain/entities/entitiePayment";
import { PaymentType } from "src/domain/enums/enumPaymentType";

export class PaymentDTO {
  id: string;
  amountPayment: number;
  paymentReference: string;
  type: PaymentType;
  date: Date;
  accountNumber: string;

  constructor(payment: Payment, accountNumber: string) {
    this.id = payment.id;
    this.amountPayment = payment.amountPayment;
    this.paymentReference = payment.paymentReference;
    this.type = payment.type;
    this.date = payment.date;
    this.accountNumber = accountNumber;
  }
}
