import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id', nullable: true })
  userId: number

  @Column({ name: 'visitor_id', nullable: true })
  visitorId: number

  @Column({ name: 'access_type', length: 20 })
  accessType: string

  @Column({ name: 'device_name', length: 50, nullable: true })
  deviceName: string

  @Column({ default: 1 })
  result: number

  @Column({ name: 'access_time', type: 'datetime' })
  accessTime: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
