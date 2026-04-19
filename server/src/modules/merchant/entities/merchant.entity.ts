import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { MerchantFavorite } from './favorite.entity'

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 100 })
  name: string

  @Column({ length: 30, nullable: true })
  category: string

  @Column({ name: 'cover_image', length: 255, nullable: true })
  coverImage: string

  @Column('json', { nullable: true })
  images: string[]

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ length: 100, nullable: true })
  address: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ name: 'business_hours', length: 100, nullable: true })
  businessHours: string

  @Column({ name: 'avg_rating', type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  avgRating: number

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number

  @Column({ length: 50, nullable: true })
  discount: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany('MerchantFavorite', 'merchant')
  favorites: MerchantFavorite[]
}
