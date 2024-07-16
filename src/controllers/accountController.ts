import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { AccountService } from 'src/services/accountService';
import { AccountDTO } from 'src/models/modelAccount';

@Controller('contas')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Get()
  async getAllAccounts() {
    const accounts = await this.accountService.findAllAccounts();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todas as contas retornadas com sucesso',
      data: accounts.map(account => new AccountDTO(account)),
    };
  }

  @Get(':accountNumber')
  findAccountByNumber(@Param('accountNumber') accountNumber: string) {
    const account = this.accountService.findAccountByNumber(accountNumber);
    return {
      statusCode: HttpStatus.OK,
      message: 'Conta retornada com sucesso',
      data: account,
    };
  }
}
