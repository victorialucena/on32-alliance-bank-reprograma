import { PaymentType } from "src/interfaces/Payment";

export class PaymentBillet implements PaymentType {
 type: 'BILLET'

 pay(amountPayment: number, paymentReference: string ): void {}

}