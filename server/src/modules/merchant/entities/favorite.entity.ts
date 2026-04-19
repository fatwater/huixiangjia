import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Merchant } from './merchant.entity'

@Entity('merchant_favorites')
export class MerchantFavorite {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'merchant_id' })
  merchantId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne('Merchant', 'favorites')
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant
}
