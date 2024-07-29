import { Module, forwardRef } from '@nestjs/common';
import { AccountModule } from './accountModule';
import { CustomerService } from 'src/services/customerService';
import { CustomerController } from 'src/controllers/customerController';


@Module({
  imports: [forwardRef(() => AccountModule)],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule { }
