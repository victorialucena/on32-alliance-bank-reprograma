import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentType } from "src/domain/enums/enumPaymentType";
import { v4 as uuidv4 } from "uuid";


@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'date' })
  public date: Date;

  @Column({ type: 'float' })
  public amountPayment: number;

  @Column({ type: 'varchar' })
  public paymentReference: string;

  @Column({ type: 'enum', enum: PaymentType })
  public type: PaymentType;

  constructor(amountPayment: number, paymentReference: string, type: PaymentType) {
    this.id = uuidv4();
    this.amountPayment = amountPayment;
    this.date = new Date();
    this.paymentReference = paymentReference;
    this.type = type;
  }
}
