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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'order_type', length: 20 })
  orderType: string

  @Column({ name: 'product_id' })
  productId: number

  @Column({ default: 1 })
  quantity: number

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number

  @Column({ length: 20, default: 'pending' })
  status: string

  @Column({ name: 'trade_no', length: 64, nullable: true })
  tradeNo: string

  @Column({ length: 200, nullable: true })
  address: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
