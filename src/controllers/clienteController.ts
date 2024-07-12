import { Controller, Get, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { ClienteService } from 'src/services/clienteService';
import { Cliente, ClienteDTO } from '../models/modelCliente';
import { Gerente } from '../models/modelGerente';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('criar')
  createCliente(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('salaryIncome') salaryIncome: number,
    @Body('gerente') gerente?: Gerente,
  ): Cliente {
    return this.clienteService.createCliente(name, address, phone, salaryIncome, gerente);
  }
  
  @Get()
  async getAllClientes(): Promise<ClienteDTO[]> {
    const clientes = await this.clienteService.getAllClientes();
    return clientes.map(cliente => new ClienteDTO(cliente));
  }

  @Get(':id')
  findClienteById(@Param('id') id: string): Cliente | undefined {
    return this.clienteService.findClienteById(id);
  }

  @Post(':idCliente/contas/:tipo')
  async abrirContaParaCliente(
    @Param('idCliente') idCliente: string,
    @Param('tipo') tipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number,
  ) {
    try {
      const conta = await this.clienteService.abrirContaParaCliente(idCliente, tipo, taxaDeJuros);
      return { message: 'Conta aberta com sucesso', conta };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Erro ao abrir conta.');
      }
    }
  }
}


