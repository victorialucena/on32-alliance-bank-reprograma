import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/domain/entities/entitieAccount';
import { IRepository } from 'src/domain/interfaces/IRepository';
import { Payment } from 'src/domain/entities/entitiePayment';

@Injectable()
export class PaymentRepository implements IRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentService: Repository<Payment>
  ) { }

  async findAll(): Promise<Payment[]> {
    return await this.paymentService.find();
  }

  async findById(id: string): Promise<Payment | null> {
    return await this.paymentService.findOne({
      where: { id },
    });
  }

  async save(payment: Payment): Promise<Payment> {
    return await this.paymentService.save(payment);
  }
}
