import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { Order } from './entities/order.entity'
import { GroupbuyService } from './groupbuy.service'
import { GroupbuyController } from './groupbuy.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order])],
  controllers: [GroupbuyController],
  providers: [GroupbuyService],
  exports: [GroupbuyService],
})
export class GroupbuyModule {}
