import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/domain/entities/entitieTransaction';
import { IRepository } from 'src/domain/interfaces/IRepository';

@Injectable()
export class TransactionRepository implements IRepository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOneBy({ id });
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }
}
