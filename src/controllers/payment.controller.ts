import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from 'src/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay-pix')
  payPix(
    @Body('amountPayment') amountPayment: number,
    @Body('paymentReference') paymentReference: string,
    @Body('accountNumber') accountNumber: string,
  ): string {
    return this.paymentService.payPix(amountPayment, paymentReference, accountNumber);
  }

  @Post('pay-billet')
  payBillet(
    @Body('amountPayment') amountPayment: number,
    @Body('paymentReference') paymentReference: string,
    @Body('accountNumber') accountNumber: string,
  ): string {
    return this.paymentService.payBillet(amountPayment, paymentReference, accountNumber);
  }
}
