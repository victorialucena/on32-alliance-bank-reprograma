import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { Manager } from "src/entities/entiteManager";
import { Account, AccountDTO } from './entitieAccount';

@Entity('customers')
export class Customer {
  public accounts: Account[] = [];

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public name: string;

  @Column()
  public address: string;

  @Column()
  public phone: string;

  @Column()
  public salaryIncome: number;

  @Column()
  public managerId?: string;

  constructor(name: string, address: string, phone: string, salaryIncome: number, managerId?: string) {
    this.id = uuidv4();
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.salaryIncome = salaryIncome;
    this.managerId = managerId;
  }
}

export class CustomerDTO {
  public accounts: Account[] = [];

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  managerId?: string;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.address = customer.address;
    this.phone = customer.phone;
    this.salaryIncome = customer.salaryIncome;
    this.accounts = customer.accounts.map(account => new AccountDTO(account));
    this.managerId = customer.managerId;
  }
}
