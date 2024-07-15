import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ContaService } from 'src/services/contaService';
import { ContaDTO } from 'src/models/modelConta';

@Controller('contas')
export class ContaController {
  constructor(private readonly contaService: ContaService) {}

  @Get()
  async getAllContas() {
    const contas = await this.contaService.findAllContas();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todas as contas retornadas com sucesso',
      data: contas.map(conta => new ContaDTO(conta)),
    };
  }

  @Get(':numeroConta')
  findContaByNumero(@Param('numeroConta') numeroConta: string) {
    const conta = this.contaService.findContaByNumero(numeroConta);
    return {
      statusCode: HttpStatus.OK,
      message: 'Conta retornada com sucesso',
      data: conta,
    };
  }
}
