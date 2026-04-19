import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column({ name: 'short_code', length: 50, unique: true })
  shortCode: string

  @Column({ length: 255, nullable: true })
  logo: string

  @Column({ length: 100, nullable: true })
  address: string

  @Column({ name: 'wecom_corp_id', length: 100, nullable: true })
  wecomCorpId: string

  @Column({ name: 'wecom_agent_id', length: 50, nullable: true })
  wecomAgentId: string

  @Column({ default: 1 })
  status: number

  @Column({ name: 'expire_date', nullable: true })
  expireDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany('User', 'tenant')
  users: User[]
}
