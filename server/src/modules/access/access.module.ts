import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Visitor } from './entities/visitor.entity'
import { AccessLog } from './entities/access-log.entity'
import { AccessService } from './access.service'
import { AccessController } from './access.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, AccessLog])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
