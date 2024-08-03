import { Module, forwardRef } from '@nestjs/common';
import { CustomerModule } from './customerModule';
import { AccountModule } from './accountModule';
import { ManagerService } from 'src/services/managerService';
import { Manager } from 'src/entities/entiteManager';
import { ManagerController } from 'src/controllers/managerController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerRepository } from 'src/repository/managerRepository';


@Module({
  imports: [forwardRef(() => CustomerModule), forwardRef(() => AccountModule), TypeOrmModule.forFeature([Manager])],
  providers: [ManagerService, ManagerRepository],
  controllers: [ManagerController],
  exports: [ManagerService, ManagerRepository]
})
export class ManagerModule { }
