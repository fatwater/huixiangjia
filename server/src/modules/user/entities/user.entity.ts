import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tenant } from '../../tenant/entities/tenant.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'wx_userid', length: 64 })
  wxUserid: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ length: 255, nullable: true })
  avatar: string

  @Column({ length: 20, default: 'employee' })
  role: string

  @Column({ default: 1 })
  status: number

  @Column({ name: 'password', length: 100, nullable: true })
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne('Tenant', 'users')
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant
}
