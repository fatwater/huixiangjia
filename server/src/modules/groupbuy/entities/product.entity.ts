import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  name: string

  @Column({ name: 'cover_image', length: 255, nullable: true })
  coverImage: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column({ name: 'original_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number

  @Column({ default: 0 })
  stock: number

  @Column({ name: 'sales_count', default: 0 })
  salesCount: number

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
