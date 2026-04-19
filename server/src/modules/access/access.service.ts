import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Visitor } from './entities/visitor.entity'
import { AccessLog } from './entities/access-log.entity'

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepository: Repository<Visitor>,
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
  ) {}

  async createVisitor(data: Partial<Visitor>): Promise<Visitor> {
    const accessCode = this.generateAccessCode()

    const visitor = this.visitorRepository.create({
      ...data,
      accessCode,
      status: 'active',
    })

    return this.visitorRepository.save(visitor)
  }

  async getMyVisitors(userId: number, status?: string) {
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const visitors = await this.visitorRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })

    const statusMap = {
      pending: '待生效',
      active: '有效',
      expired: '已过期',
    }

    return visitors.map((v) => ({
      ...v,
      status_text: statusMap[v.status] || v.status,
    }))
  }

  async getAccessCode(visitorId: number) {
    const visitor = await this.visitorRepository.findOne({
      where: { id: visitorId },
    })

    if (!visitor) {
      throw new Error('访客记录不存在')
    }

    const visitDate = new Date(visitor.visitDate)
    visitDate.setHours(23, 59, 59, 999)

    return {
      access_code: visitor.accessCode,
      expires_at: visitDate.toISOString(),
    }
  }

  async getAccessRecords(
    userId?: number,
    startDate?: string,
    endDate?: string,
    page = 1,
    pageSize = 10,
  ) {
    const where: any = {}
    if (userId) {
      where.userId = userId
    }

    const [list, total] = await this.accessLogRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { accessTime: 'DESC' },
    })

    const typeMap = {
      qr: '二维码通行',
      bluetooth: '蓝牙通行',
      manual: '手动开门',
    }

    return {
      list: list.map((log) => ({
        ...log,
        access_type_text: typeMap[log.accessType] || log.accessType,
      })),
      total,
      page,
      pageSize,
    }
  }

  private generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}
