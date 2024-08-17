import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { Customer } from "./entitieCustomer";
import { IAccountOperations } from "src/domain/interfaces/IAccountOperations";
import { AccountType } from "src/domain/enums/enumAccountType";

@Entity('accounts')
export class Account implements IAccountOperations {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ unique: true })
  accountNumber: string;

  @Column()
  balance: number;

  @ManyToOne(() => Customer, customer => customer.accounts, { eager: true })
  customer: Customer;

  constructor(type: AccountType, accountNumber: string, balance: number, customer: Customer) {
    this.id = uuidv4();
    this.type = type;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.customer = customer;
  }

  deposit(amount: number): void { };
  checkBalance(): void { };
  withdraw(amount: number): void { };
  transfer(amount: number, toAccount: Account): void { };
}

