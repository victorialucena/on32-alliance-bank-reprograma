import { PaymentType } from "src/interfaces/Payment";

export class PaymentPix implements PaymentType {
 type: 'PIX'

 pay(amountPayment: number, paymentReference: string ): void {}

}