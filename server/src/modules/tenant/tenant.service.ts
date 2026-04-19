import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Tenant } from './entities/tenant.entity'
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.tenantRepository.findOne({
      where: { shortCode: dto.shortCode },
    })
    if (existing) {
      throw new ConflictException('租户短码已存在')
    }
    const tenant = this.tenantRepository.create(dto)
    return this.tenantRepository.save(tenant)
  }

  async findAll(page = 1, pageSize = 20): Promise<{ list: Tenant[]; total: number }> {
    const [list, total] = await this.tenantRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return { list, total }
  }

  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } })
    if (!tenant) {
      throw new NotFoundException('租户不存在')
    }
    return tenant
  }

  async findByShortCode(shortCode: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { shortCode } })
    if (!tenant) {
      throw new NotFoundException('租户不存在')
    }
    return tenant
  }

  async update(id: number, dto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id)
    Object.assign(tenant, dto)
    return this.tenantRepository.save(tenant)
  }

  async remove(id: number): Promise<void> {
    const tenant = await this.findOne(id)
    await this.tenantRepository.remove(tenant)
  }
}
