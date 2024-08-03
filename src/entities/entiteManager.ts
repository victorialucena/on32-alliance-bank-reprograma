import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { Customer, CustomerDTO } from "src/entities/entitieCustomer";

@Entity('managers')
export class Manager {

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public name: string;

  public  customers: Customer[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}

export class ManagerDTO {
  id: string;
  name: string;
  customers: CustomerDTO[];

  constructor(manager: Manager) {
    this.id = manager.id;
    this.name = manager.name;
    this.customers = manager.customers.map(customer => new CustomerDTO(customer));
  }
}
