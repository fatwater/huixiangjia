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

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'host_id' })
  hostId: number

  @Column({ name: 'visitor_name', length: 50 })
  visitorName: string

  @Column({ name: 'visitor_phone', length: 20 })
  visitorPhone: string

  @Column({ name: 'visitor_company', length: 100, nullable: true })
  visitorCompany: string

  @Column({ name: 'visit_purpose', length: 200, nullable: true })
  visitPurpose: string

  @Column({ name: 'visit_date', type: 'date' })
  visitDate: string

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string

  @Column({ name: 'qr_code', length: 128, nullable: true })
  qrCode: string

  @Column({ length: 20, default: 'pending' })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User
}
