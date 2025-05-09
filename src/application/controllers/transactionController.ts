import { Controller, Get, Param, Post, Body, NotFoundException } from '@nestjs/common';
import { TransactionService } from 'src/domain/services/transactionService'; 
import { Transaction } from 'src/domain/entities/entitieTransaction'; 

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body('type') type: string,
    @Body('amount') amount: number,
    @Body('balanceAfterTransaction') balanceAfterTransaction: number,
    @Body('accountNumber') accountNumber: string
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(
      type,
      amount,
      balanceAfterTransaction,
      accountNumber
    );
  }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Transaction> {
    const transaction = await this.transactionService.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    return transaction;
  }
}
