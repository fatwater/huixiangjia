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
    if (product.stock < (data.quantity || 1)) {
      throw new BadRequestException('库存不足')
    }

    const orderNo = `GB${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const quantity = data.quantity || 1

    const order = this.orderRepository.create({
      ...data,
      orderNo,
      totalAmount: product.groupbuyPrice * quantity,
      quantity,
      status: 1, // 待支付
      payStatus: 0,
      groupStatus: 0,
      pickupCode: this.generatePickupCode(),
    })

    await this.productRepository.update(data.productId, {
      stock: product.stock - quantity,
      soldCount: product.soldCount + quantity,
    })

    return this.orderRepository.save(order)
  }

  async getMyOrders(userId: number, status?: string, page = 1, pageSize = 10) {
    const where: any = { userId }
    if (status) {
      where.status = parseInt(status)
    }

    const [list, total] = await this.orderRepository.findAndCount({
      where,
      relations: ['product'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    const statusMap: Record<number, string> = {
      0: '已取消',
      1: '待支付',
      2: '待提货',
      3: '已完成',
    }

    return {
      list: list.map((o) => ({
        id: o.id,
        orderNo: o.orderNo,
        productId: o.productId,
        product: o.product,
        quantity: o.quantity,
        totalAmount: o.totalAmount,
        pickupCode: o.pickupCode,
        status: o.status,
        statusText: statusMap[o.status] || '未知',
        createdAt: o.createdAt,
      })),
      total,
      page,
      pageSize,
    }
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id } })
    if (order) {
      // 恢复库存
      const product = await this.productRepository.findOne({ where: { id: order.productId } })
      if (product) {
        await this.productRepository.update(order.productId, {
          stock: product.stock + order.quantity,
          soldCount: product.soldCount - order.quantity,
        })
      }
      await this.orderRepository.update(id, { status: 0 })
    }
  }

  async payOrder(id: number, transactionId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['product'],
    })

    if (!order) {
      throw new BadRequestException('订单不存在')
    }

    if (order.payStatus === 1) {
      throw new BadRequestException('订单已支付')
    }

    order.payStatus = 1
    order.payTime = new Date()
    order.status = 2 // 待提货
    if (transactionId) {
      order.tradeNo = transactionId
    }

    return this.orderRepository.save(order)
  }

  async pickupOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } })

    if (!order) {
      throw new BadRequestException('订单不存在')
    }

    if (order.status !== 2) {
      throw new BadRequestException('订单状态不正确')
    }

    order.status = 3 // 已完成
    order.pickupTime = new Date()

    return this.orderRepository.save(order)
  }

  private generatePickupCode(): string {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }
}
