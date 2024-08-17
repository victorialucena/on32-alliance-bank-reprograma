import { Account } from "src/domain/entities/entitieAccount";
import { Customer } from "src/domain/entities/entitieCustomer";
import { AccountDTOO } from "./accountDTO";

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
  this.accounts = customer.accounts.map(account => new AccountDTOO(account));
  this.managerId = customer.managerId;
 }
}