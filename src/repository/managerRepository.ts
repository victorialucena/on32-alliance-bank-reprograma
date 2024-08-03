import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manager } from 'src/entities/entiteManager';

Injectable()
export class ManagerRepository {
 constructor(
  @InjectRepository(Manager)
  private readonly userRepository: Repository<Manager>
 ) { }

 async findAll(): Promise<Manager[]> {
  return await this.userRepository.find()
 }

 async findById(id: string): Promise<Manager | null> {
  return this.userRepository.findOne({
   where: { id },
  });
 }

 async save(manager: Manager): Promise<Manager> {
  return await this.userRepository.save(manager);
 }

 async delete(id: string): Promise<boolean> {
  const result = await this.userRepository.delete(id);
  return result.affected > 0;
 }

}