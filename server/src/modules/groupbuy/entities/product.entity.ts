import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Order } from './order.entity'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  title: string

  @Column({ name: 'cover_image', length: 255, nullable: true })
  coverImage: string

  @Column('json', { nullable: true })
  images: string[]

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number

  @Column({ name: 'groupbuy_price', type: 'decimal', precision: 10, scale: 2 })
  groupbuyPrice: number

  @Column({ name: 'min_group_size', default: 2 })
  minGroupSize: number

  @Column({ default: 0 })
  stock: number

  @Column({ name: 'sold_count', default: 0 })
  soldCount: number

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime: Date

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime: Date

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[]
}
