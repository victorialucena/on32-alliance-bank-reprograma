import { Module, forwardRef } from '@nestjs/common';
import { CustomerModule } from './customerModule';
import { AccountModule } from './accountModule';
import { ManagerService } from 'src/services/managerService';
import { Manager } from 'src/models/modelManager';
import { ManagerController } from 'src/controllers/managerController';


@Module({
  imports: [forwardRef(() => CustomerModule), forwardRef(() => AccountModule)],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService]
})
export class ManagerModule { }
