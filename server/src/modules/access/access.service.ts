import { Injectable, NotFoundException } from '@nestjs/common'
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
    const qrCode = this.generateAccessCode()

    const visitor = this.visitorRepository.create({
      ...data,
      qrCode,
      status: 'pending',
    })

    return this.visitorRepository.save(visitor)
  }

  async getMyVisitors(hostId: number, status?: string) {
    const where: any = { hostId }
    if (status) {
      where.status = status
    }

    const visitors = await this.visitorRepository.find({
      where,
      order: { createdAt: 'DESC' },
    })

    const statusMap: Record<string, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      completed: '已完成',
    }

    return visitors.map((v) => ({
      id: v.id,
      visitorName: v.visitorName,
      visitorPhone: v.visitorPhone,
      visitorCompany: v.visitorCompany,
      visitPurpose: v.visitPurpose,
      visitDate: v.visitDate,
      startTime: v.startTime,
      endTime: v.endTime,
      status: v.status,
      statusText: statusMap[v.status] || v.status,
      qrCode: v.qrCode,
      createdAt: v.createdAt,
    }))
  }

  async getAccessCode(visitorId: number) {
    const visitor = await this.visitorRepository.findOne({
      where: { id: visitorId },
    })

    if (!visitor) {
      throw new NotFoundException('访客记录不存在')
    }

    const visitDate = new Date(visitor.visitDate)
    visitDate.setHours(23, 59, 59, 999)

    return {
      id: visitor.id,
      qr_code: visitor.qrCode,
      visitor_name: visitor.visitorName,
      visit_date: visitor.visitDate,
      expires_at: visitDate.toISOString(),
    }
  }

  async getAccessRecords(
    userId?: number,
    startDate?: string,
    endDate?: string,
    page = 1,
    pageSize = 20,
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

    const typeMap: Record<string, string> = {
      qr: '二维码通行',
      nfc: 'NFC通行',
      face: '人脸通行',
      password: '密码通行',
    }

    const resultMap: Record<string, string> = {
      allowed: '允许',
      denied: '拒绝',
    }

    return {
      list: list.map((log) => ({
        id: log.id,
        userId: log.userId,
        deviceName: log.deviceName,
        accessType: log.accessType,
        accessTypeText: typeMap[log.accessType] || log.accessType,
        accessResult: log.accessResult,
        accessResultText: resultMap[log.accessResult] || log.accessResult,
        accessTime: log.accessTime,
      })),
      total,
      page,
      pageSize,
    }
  }

  private generateAccessCode(): string {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}
