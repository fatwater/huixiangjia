import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 50 })
  category: string

  @Column({ length: 200 })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column('json', { nullable: true })
  photos: string[]

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'coupon_info', length: 200, nullable: true })
  couponInfo: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
