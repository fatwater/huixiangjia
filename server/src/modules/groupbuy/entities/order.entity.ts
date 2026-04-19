import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Product } from './product.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'order_no', length: 32, unique: true })
  orderNo: string

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'product_id' })
  productId: number

  @Column({ default: 1 })
  quantity: number

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ name: 'group_code', length: 32, nullable: true })
  groupCode: string

  @Column({ name: 'group_status', default: 0 })
  groupStatus: number

  @Column({ name: 'pay_status', default: 0 })
  payStatus: number

  @Column({ name: 'pay_time', type: 'datetime', nullable: true })
  payTime: Date

  @Column({ name: 'pickup_code', length: 16, nullable: true })
  pickupCode: string

  @Column({ name: 'pickup_time', type: 'datetime', nullable: true })
  pickupTime: Date

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
