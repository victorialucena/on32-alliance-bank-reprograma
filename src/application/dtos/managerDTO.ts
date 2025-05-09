import { Manager } from "src/domain/entities/entiteManager";
import { CustomerDTO } from "./customerDTO";


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
