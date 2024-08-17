// src/application/controllers/payment.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from 'src/domain/services/payment.service';
import { PaymentDTO } from '../dtos/paymentDTO';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: PaymentDTO) {
    const { amountPayment, paymentReference, accountNumber, type } = createPaymentDto;
    return await this.paymentService.pay(amountPayment, paymentReference, accountNumber, type);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return await this.paymentService.findPaymentById(id);
  }

  @Get()
  async getAllPayments() {
    return await this.paymentService.findAllPayments();
  }
}
