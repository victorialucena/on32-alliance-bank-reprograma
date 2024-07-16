import { Module } from '@nestjs/common';
import {CustomerModule } from './modules/customerModule';
import { AccountModule} from './modules/accountModule';
import {ManagerModule } from './modules/managerModule';
import { CustomerController } from './controllers/customerController';
import { AccountController } from './controllers/accountController';
import { ManagerController } from './controllers/managerController';

@Module({
  imports: [CustomerModule, AccountModule, ManagerModule],
  controllers: [CustomerController, AccountController, ManagerController],
  providers: [],
})
export class AppModule { }
