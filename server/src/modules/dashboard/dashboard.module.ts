import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { Tenant } from '../tenant/entities/tenant.entity'
import { User } from '../user/entities/user.entity'
import { SpaceBooking } from '../property/entities/booking.entity'
import { Order } from '../groupbuy/entities/order.entity'
import { Merchant } from '../merchant/entities/merchant.entity'
import { Visitor } from '../access/entities/visitor.entity'
import { AccessLog } from '../access/entities/access-log.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      User,
      SpaceBooking,
      Order,
      Merchant,
      Visitor,
      AccessLog,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
