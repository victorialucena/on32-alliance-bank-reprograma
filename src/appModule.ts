import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './modules/customerModule';
import { AccountModule } from './modules/accountModule';
import { ManagerModule } from './modules/managerModule';
import { CustomerController } from './application/controllers/customerController';
import { AccountController } from './application/controllers/accountController';
import { ManagerController } from './application/controllers/managerController';
import { PaymentModule } from './modules/payment.module';
import { PaymentController } from './application/controllers/payment.controller';
import { Manager } from './domain/entities/entiteManager';
import { Customer } from './domain/entities/entitieCustomer';
import { Account } from './domain/entities/entitieAccount';
import { Payment } from './domain/entities/entitiePayment';
import { Transaction } from './domain/entities/entitieTransaction';
import { TransactionModule } from './modules/transactionModule';
import { TransactionController } from './application/controllers/transactionController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Manager, Customer, Account, Payment, Transaction],
        synchronize: true,
      }),
    }),
    CustomerModule,
    AccountModule,
    ManagerModule,
    PaymentModule,
    TransactionModule,
  ],
  controllers: [
    CustomerController,
    AccountController,
    ManagerController,
    PaymentController,
    TransactionController,
  ],
  providers: [],
})
export class AppModule {}
