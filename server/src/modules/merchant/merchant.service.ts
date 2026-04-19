import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Merchant } from './entities/merchant.entity'
import { MerchantFavorite } from './entities/favorite.entity'

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
    @InjectRepository(MerchantFavorite)
    private favoriteRepository: Repository<MerchantFavorite>,
  ) {}

  async getMerchants(
    tenantId: number,
    keyword?: string,
    category?: string,
    page = 1,
    pageSize = 10,
  ) {
    const where: any = { tenantId }
    if (category) {
      where.category = category
    }
    if (keyword) {
      where.name = Like(`%${keyword}%`)
    }

    const [list, total] = await this.merchantRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async getMerchantById(id: number) {
    return this.merchantRepository.findOne({ where: { id } })
  }

  async favorite(userId: number, merchantId: number) {
    const existing = await this.favoriteRepository.findOne({
      where: { userId, merchantId },
    })
    if (existing) {
      return { favorited: true }
    }

    const favorite = this.favoriteRepository.create({ userId, merchantId })
    await this.favoriteRepository.save(favorite)
    return { favorited: true }
  }

  async unfavorite(userId: number, merchantId: number) {
    await this.favoriteRepository.delete({ userId, merchantId })
    return { favorited: false }
  }

  async getMyFavorites(userId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['merchant'],
    })
    return favorites.map((f) => f.merchant)
  }

  async create(data: Partial<Merchant>): Promise<Merchant> {
    const merchant = this.merchantRepository.create(data)
    return this.merchantRepository.save(merchant)
  }

  async update(id: number, data: Partial<Merchant>): Promise<void> {
    await this.merchantRepository.update(id, data)
  }

  async delete(id: number): Promise<void> {
    await this.merchantRepository.delete(id)
  }
}
