import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from 'src/domain/services/customerService';
import { CustomerController } from 'src/application/controllers/customerController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/domain/entities/entitieCustomer';
import { CustomerRepository } from 'src/infrastructure/repository/customerRepository';
import { AccountModule } from './accountModule';

@Module({
  imports: [forwardRef(() => AccountModule), TypeOrmModule.forFeature([Customer])],
  providers: [CustomerService, CustomerRepository],
  controllers: [CustomerController],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule { }
