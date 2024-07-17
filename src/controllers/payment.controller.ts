import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { PaymentService } from "src/services/payment.service";

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
    if (paymentMethod === 'PIX') {
      return this.paymentService.payPix(amountPayment, paymentReference, accountNumber);
    } else if (paymentMethod === 'BILLET') {
      return this.paymentService.payBillet(amountPayment, paymentReference, accountNumber);
    } else {
      throw new BadRequestException('Método de pagamento inválido');
    }
  }
}
