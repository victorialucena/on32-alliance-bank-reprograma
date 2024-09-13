import {
 Entity,
 Column,
 PrimaryGeneratedColumn,
 ManyToOne,
 CreateDateColumn
} from 'typeorm';
import { Account } from './entitieAccount';
import { TransactionType } from '../enums/enumTransactionType';


@Entity('transactions')
export class Transaction {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column({ type: 'enum', enum: TransactionType })
 type: TransactionType;

 @Column('decimal')
 amount: number;

 @Column('decimal')
 balanceAfterTransaction: number;

 @ManyToOne(() => Account, account => account.transactions, { eager: true })
 account: Account;

 @CreateDateColumn()
 createdAt: Date;
}
