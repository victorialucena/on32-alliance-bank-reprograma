import { PaymentType } from "src/domain/enums/enumPaymentType"

export interface IPayment {
 type: PaymentType

 pay(amountPayment: number, paymentReference: string): void
}