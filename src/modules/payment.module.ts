// src/application/payment/payment.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from 'src/infrastructure/repository/paymentRepository';
import { Payment } from 'src/domain/entities/entitiePayment';
import { PaymentController } from 'src/application/controllers/payment.controller';
import { AccountService } from 'src/domain/services/accountService';
import { PaymentService } from 'src/domain/services/payment.service';
import { AccountRepository } from 'src/infrastructure/repository/accountRepository';
import { AccountModule } from './accountModule';
import { CustomerModule } from './customerModule';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), forwardRef(() => CustomerModule), forwardRef(() => AccountModule)],
  providers: [PaymentService, PaymentRepository, AccountService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
