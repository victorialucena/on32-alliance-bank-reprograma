import { Controller, Get, Param, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ContaService } from 'src/services/contaService';
import { ContaCorrente, ContaCorrenteDTO } from '../models/modelContaCorrente';
import { ContaPoupanca, ContaPoupancaDTO } from '../models/modelContaPoupanca';
import { ContaDTO } from 'src/models/modelConta';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

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
