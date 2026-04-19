import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

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
}
