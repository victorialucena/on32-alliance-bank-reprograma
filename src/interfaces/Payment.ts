import { PaymentType } from "src/enums/enumPaymentType"

export interface Payment{
 type: PaymentType

 pay(amountPayment: number, paymentReference: string ): void
}