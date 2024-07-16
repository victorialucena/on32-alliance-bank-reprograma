import { v4 as uuidv4 } from "uuid";
import { Manager } from "src/models/modelManager";
import { Account, AccountDTO } from "./modelAccount";

export class Customer {
  public accounts: Account[] = [];

  id: string;
  name: string;
  address: string;
  phone: string;
  salaryIncome: number;
  managerId?: string;

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
