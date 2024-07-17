import { Module } from '@nestjs/common';
import {CustomerModule } from './modules/customerModule';
import { AccountModule} from './modules/accountModule';
import {ManagerModule } from './modules/managerModule';
import { CustomerController } from './controllers/customerController';
import { AccountController } from './controllers/accountController';
import { ManagerController } from './controllers/managerController';
import { PaymentModule } from './modules/payment.module';
import { PaymentController } from './controllers/payment.controller';

@Module({
  imports: [CustomerModule, AccountModule, ManagerModule, PaymentModule],
  controllers: [CustomerController, AccountController, ManagerController, PaymentController],
  providers: [],
})
export class AppModule { }
