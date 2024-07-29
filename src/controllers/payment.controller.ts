import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { PaymentService } from "src/services/payment.service";
import { PaymentType } from "src/enums/enumPaymentType";

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  pay(
    @Body('amountPayment') amountPayment: number,
    @Body('paymentReference') paymentReference: string,
    @Body('accountNumber') accountNumber: string,
    @Body('paymentMethod') paymentMethod: string, 
  ): string {
    if (paymentMethod === PaymentType.PIX) {
      return this.paymentService.payPix(amountPayment, paymentReference, accountNumber);
    }
    
    if (paymentMethod === PaymentType.BILLET) {
      return this.paymentService.payBillet(amountPayment, paymentReference, accountNumber);
    }
    
    throw new BadRequestException('Método de pagamento inválido');
  }
}
