import { v4 as uuidv4 } from "uuid";
import { Customer, CustomerDTO } from "src/models/modelCustomer";

export class Manager {
  id: string;
  name: string;
  customers: Customer[] = [];

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
