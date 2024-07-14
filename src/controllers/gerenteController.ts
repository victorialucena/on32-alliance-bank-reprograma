import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { GerenteService } from '../services/gerenteService';
import { GerenteDTO } from '../models/modelGerente';

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
      data: new GerenteDTO(newGerente),
    };
  }

  @Get(':gerenteId')
  getGerenteById(
    @Param('gerenteId') gerenteId: string,
  ): GerenteDTO {
    const gerente = this.gerenteService.findGerenteById(gerenteId);
    if (!gerente) {
      throw new Error(`Gerente com ID ${gerenteId} não encontrado.`);
    }
    return new GerenteDTO(gerente);
  }

  @Patch(':gerenteId/cliente')
  associateCliente(
    @Param('gerenteId') gerenteId: string,
    @Body() body: { clienteId: string },
  ) {
    this.gerenteService.associateCliente(gerenteId, body.clienteId);
    return {
      message: `Cliente com ID ${body.clienteId} associado ao gerente ${gerenteId} com sucesso.`,
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

  @Get()
  async getAllGerentes(): Promise<GerenteDTO[]> {
    const gerentes = this.gerenteService.getAllGerentes();
    return gerentes.map(gerente => new GerenteDTO(gerente));
  }
}
