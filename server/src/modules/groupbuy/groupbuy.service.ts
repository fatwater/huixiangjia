import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'
import { Order } from './entities/order.entity'

@Injectable()
export class GroupbuyService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getProducts(tenantId: number, status?: number, page = 1, pageSize = 10) {
    const where: any = { tenantId }
    if (status !== undefined) {
      where.status = status
    }

    const [list, total] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async getProductById(id: number) {
    return this.productRepository.findOne({ where: { id } })
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data)
    return this.productRepository.save(product)
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<void> {
    await this.productRepository.update(id, data)
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id)
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    })
    if (!product) {
      throw new BadRequestException('商品不存在')
    }
    if (product.stock < data.quantity) {
      throw new BadRequestException('库存不足')
    }

    const tradeNo = `GB${Date.now()}${Math.random().toString(36).substr(2, 9)}`

    const order = this.orderRepository.create({
      ...data,
      tradeNo,
      totalAmount: product.price * data.quantity,
      status: 'paid',
    })

    await this.productRepository.update(data.productId, {
      stock: product.stock - data.quantity,
      salesCount: product.salesCount + data.quantity,
    })

    return this.orderRepository.save(order)
  }

  async getMyOrders(userId: number, status?: string, page = 1, pageSize = 10) {
    const where: any = { userId, orderType: 'groupbuy' }
    if (status) {
      where.status = status
    }

    const [list, total] = await this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async cancelOrder(id: number): Promise<void> {
    await this.orderRepository.update(id, { status: 'cancelled' })
  }
}
