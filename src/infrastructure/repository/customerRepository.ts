import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/domain/entities/entitieCustomer';
import { IRepository } from 'src/domain/interfaces/IRepository';

Injectable()
export class CustomerRepository  implements IRepository<Customer> {
 constructor(
  @InjectRepository(Customer)
  private readonly userRepository: Repository<Customer>
 ) { }

 async findAll(): Promise<Customer[]> {
  return await this.userRepository.find()
 }

 async findById(id: string): Promise<Customer | null> {
  return this.userRepository.findOne({
   where: { id },
  });
 }

 async save(customer: Customer): Promise<Customer> {
  return await this.userRepository.save(customer);
 }

 async delete(id: string): Promise<boolean> {
  const result = await this.userRepository.delete(id);
  return result.affected > 0;
 }

}