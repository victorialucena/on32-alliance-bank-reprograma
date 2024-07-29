import { Payment } from "src/interfaces/Payment";
import { PaymentType } from "src/enums/enumPaymentType";

export class PaymentBillet implements Payment {
 type: PaymentType.BILLET

 pay(amountPayment: number, paymentReference: string ): void {}

}