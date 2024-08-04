import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/entitieAccount';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
  ) { }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findById(id: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { id },
    });
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { accountNumber },
    });
  }

  async save(account: Account): Promise<Account> {
    return await this.accountRepository.save(account);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.accountRepository.delete(id);
    return result.affected > 0;
  }
}
