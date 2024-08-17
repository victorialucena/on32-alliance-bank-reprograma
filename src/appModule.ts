import { Module } from '@nestjs/common';
import { CustomerModule } from './modules/customerModule';
import { AccountModule } from './modules/accountModule';
import { ManagerModule } from './modules/managerModule';
import { CustomerController } from './application/controllers/customerController';
import { AccountController } from './application/controllers/accountController';
import { ManagerController } from './application/controllers/managerController';
import { PaymentModule } from './modules/payment.module';
import { PaymentController } from './application/controllers/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './domain/entities/entiteManager';
import { Customer } from './domain/entities/entitieCustomer';
import { Account } from './domain/entities/entitieAccount';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    database: 'postgres',
    username: 'postgres',
    password: '#Helo2019',
    entities: [Manager, Customer, Account],
    synchronize: true,
  }), CustomerModule, AccountModule, ManagerModule, PaymentModule],
  controllers: [CustomerController, AccountController, ManagerController, PaymentController],
  providers: [],
})
export class AppModule { }
