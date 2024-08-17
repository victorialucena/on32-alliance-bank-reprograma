import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from '../domain/services/payment.service';
import { PaymentController } from '../application/controllers/payment.controller';
import { AccountModule } from './accountModule';
import { CustomerModule } from './customerModule';

@Module({
  imports: [forwardRef(() => CustomerModule), forwardRef(() => AccountModule)],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule { }
