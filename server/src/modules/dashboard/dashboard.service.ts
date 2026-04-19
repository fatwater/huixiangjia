import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThan } from 'typeorm'
import { Tenant } from '../tenant/entities/tenant.entity'
import { User } from '../user/entities/user.entity'
import { SpaceBooking } from '../property/entities/booking.entity'
import { Order } from '../groupbuy/entities/order.entity'
import { Merchant } from '../merchant/entities/merchant.entity'
import { Visitor } from '../access/entities/visitor.entity'
import { AccessLog } from '../access/entities/access-log.entity'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SpaceBooking)
    private bookingRepository: Repository<SpaceBooking>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) {}

  async getStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      tenantCount,
      employeeCount,
      bookingCount,
      todayBookingCount,
      orderCount,
      merchantCount,
      visitorCount,
      recentAccessLogs,
    ] = await Promise.all([
      this.tenantRepository.count({ where: { status: 1 } }),
      this.userRepository.count({ where: { status: 1 } }),
      this.bookingRepository.count(),
      this.bookingRepository.count({
        where: { createdAt: MoreThan(today) },
      }),
      this.orderRepository.count(),
      this.merchantRepository.count({ where: { status: 1 } }),
      this.visitorRepository.count(),
      this.accessLogRepository.find({
        order: { accessTime: 'DESC' },
        take: 10,
      }),
    ])

    // 订单金额统计
    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(total_amount)', 'totalAmount')
      .addSelect('AVG(total_amount)', 'avgAmount')
      .getRawOne()

    return {
      tenantCount,
      employeeCount,
      bookingCount,
      todayBookingCount,
      orderCount,
      merchantCount,
      visitorCount,
      totalRevenue: orderStats?.totalAmount || 0,
      avgOrderAmount: orderStats?.avgAmount || 0,
      recentAccessLogs,
    }
  }

  async getTenantStats(tenantId: number) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      employeeCount,
      bookingCount,
      todayBookingCount,
      orderCount,
      merchantCount,
      visitorCount,
    ] = await Promise.all([
      this.userRepository.count({ where: { tenantId, status: 1 } }),
      this.bookingRepository.count({ where: { tenantId } }),
      this.bookingRepository.count({
        where: { tenantId, createdAt: MoreThan(today) },
      }),
      this.orderRepository.count({ where: { tenantId } }),
      this.merchantRepository.count({ where: { tenantId, status: 1 } }),
      this.visitorRepository.count({ where: { tenantId } }),
    ])

    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(total_amount)', 'totalAmount')
      .addSelect('AVG(total_amount)', 'avgAmount')
      .where('order.tenant_id = :tenantId', { tenantId })
      .getRawOne()

    return {
      employeeCount,
      bookingCount,
      todayBookingCount,
      orderCount,
      merchantCount,
      visitorCount,
      totalRevenue: orderStats?.totalAmount || 0,
      avgOrderAmount: orderStats?.avgAmount || 0,
    }
  }
}
