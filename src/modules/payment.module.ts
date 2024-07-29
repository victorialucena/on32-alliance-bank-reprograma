import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { PaymentController } from '../controllers/payment.controller';
import { AccountModule } from './accountModule';
import { CustomerModule } from './customerModule';

@Module({
  imports: [forwardRef(() => CustomerModule), forwardRef(() => AccountModule)],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule { }
