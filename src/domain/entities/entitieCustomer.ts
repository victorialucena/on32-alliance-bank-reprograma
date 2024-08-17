import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { Manager } from "src/domain/entities/entiteManager";
import { Account } from './entitieAccount';

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