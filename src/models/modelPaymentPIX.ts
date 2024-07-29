import { Payment } from "src/interfaces/Payment";
import { PaymentType } from "src/enums/enumPaymentType";

export class PaymentPix implements Payment {
 type: PaymentType.PIX

 pay(amountPayment: number, paymentReference: string ): void {}

}