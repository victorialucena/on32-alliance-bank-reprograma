import { IPayment } from "src/domain/interfaces/IPayment";
import { PaymentType } from "src/domain/enums/enumPaymentType";

export class PaymentPix implements IPayment {
 type: PaymentType.PIX

 pay(amountPayment: number, paymentReference: string): void { }

}