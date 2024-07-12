import { Controller, Get, Param, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ContaService } from 'src/services/contaService';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { ContaDTO } from 'src/models/modelConta';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Post(':clienteId/:tipo')
  async abrirContaParaCliente(
    @Param('clienteId') clienteId: string,
    @Param('tipo') tipo: 'CORRENTE' | 'POUPANCA',
    @Body('taxaDeJuros') taxaDeJuros?: number,
  ): Promise<ContaCorrenteDTO | ContaPoupancaDTO> {
    try {
      const conta = await this.contaService.createConta(clienteId, tipo, taxaDeJuros);
      return conta;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Erro ao abrir conta.');
      }
    }
  }
  


  @Get()
  async getAllContas(): Promise<ContaDTO[]> {
    const contas = await this.contaService.findAllContas();
    return contas.map(conta => new ContaDTO(conta));
  }

  @Get(':numeroConta')
  findContaByNumero(@Param('numeroConta') numeroConta: string): ContaCorrente | ContaPoupanca | undefined {
    return this.contaService.findContaByNumero(numeroConta);
  }
}
