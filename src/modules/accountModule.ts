import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from '../services/accountService';
import { AccountController } from '../controllers/accountController';
import { CustomerModule} from './customerModule';

@Module({
  imports: [forwardRef(() => CustomerModule)],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule { }
