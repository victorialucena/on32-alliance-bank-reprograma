import { Conta } from "src/models/modelConta";

export interface OperacoesConta {
 depositar(valor: number): void;
 verificarSaldo(): void;
 sacar(valor: number): void;
 transferir(valor: number, paraConta: Conta): void;
}
