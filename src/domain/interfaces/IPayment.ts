import { PaymentType } from "src/domain/enums/enumPaymentType"

export interface IPayment {
 
 id: string
 date: Date
 type: PaymentType
 amountPayment: number
 paymentReference: string

 pay(amountPayment: number, paymentReference: string): void
}