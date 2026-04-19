import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { SpaceBooking } from './booking.entity'

@Entity('meeting_rooms')
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ length: 50 })
  name: string

  @Column({ length: 100, nullable: true })
  location: string

  @Column({ default: 10 })
  capacity: number

  @Column({ name: 'facilities', nullable: true })
  facilities: string

  @Column({ default: 1 })
  status: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => SpaceBooking, (booking) => booking.room)
  bookings: SpaceBooking[]
}