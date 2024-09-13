import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from 'src/infrastructure/repository/paymentRepository';
import { Payment } from 'src/domain/entities/entitiePayment';
import { PaymentController } from 'src/application/controllers/payment.controller';
import { PaymentService } from 'src/domain/services/payment.service';
import { AccountModule } from './accountModule';
import { CustomerModule } from './customerModule';
import { TransactionModule } from './transactionModule';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), forwardRef(() => CustomerModule), forwardRef(() => AccountModule), forwardRef(() => TransactionModule)],
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
