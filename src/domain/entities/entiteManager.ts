import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { Customer } from "src/domain/entities/entitieCustomer";

@Entity('managers')
export class Manager {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public name: string;

  public customers: Customer[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}
