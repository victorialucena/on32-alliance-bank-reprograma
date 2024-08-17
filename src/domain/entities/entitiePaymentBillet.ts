import { IPayment } from "src/domain/interfaces/IPayment";
import { PaymentType } from "src/domain/enums/enumPaymentType";

export class PaymentBillet implements IPayment {
 type: PaymentType.BILLET

 pay(amountPayment: number, paymentReference: string): void { }

}