import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { GerenteService } from '../services/gerenteService';
import { Gerente } from '../models/modelGerente';

@Controller('gerentes')
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) { }

  @Post('criar')
  createGerente(
    @Body('nome') nome: string,
  ) {
    const newGerente = this.gerenteService.createGerente(nome);
    return {
      message: 'Gerente criado com sucesso.',
      data: newGerente,
    };
  }

  @Get(':gerenteId')
  getGerenteById(
    @Param('gerenteId') gerenteId: string,
  ): Gerente {
    const gerente = this.gerenteService.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }
    return gerente;
  }

  @Patch(':gerenteId/cliente')
  associateCliente(
    @Param('gerenteId') gerenteId: string,
    @Body() body: { clienteId: string },
  ) {
    const gerente = this.gerenteService.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }

    const { clienteId } = body;

    this.gerenteService.associateCliente(gerenteId, clienteId);

    return {
      message: `Cliente com ID ${clienteId} associado ao gerente ${gerenteId} com sucesso.`,
    };
  }

  @Patch(':gerenteId/cliente/:clienteId/remover')
  removeCliente(
    @Param('gerenteId') gerenteId: string,
    @Param('clienteId') clienteId: string,
  ) {
    this.gerenteService.removeCliente(gerenteId, clienteId);
    return {
      message: `Cliente com ID ${clienteId} removido do gerente ${gerenteId} com sucesso.`,
    };
  }
}
