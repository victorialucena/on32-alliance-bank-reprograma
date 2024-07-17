export interface PaymentType {
 type: 'PIX' | 'BILLET'

 pay(amountPayment: number, paymentReference: string ): void
}