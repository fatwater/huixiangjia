import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'visitor_name', length: 50 })
  visitorName: string

  @Column({ length: 20 })
  phone: string

  @Column({ name: 'visit_date', type: 'date' })
  visitDate: string

  @Column({ length: 200, nullable: true })
  purpose: string

  @Column({ name: 'access_code', length: 32 })
  accessCode: string

  @Column({ length: 20, default: 'pending' })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
