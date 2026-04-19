import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { MeetingRoom } from './meeting-room.entity'

@Entity('room_bookings')
export class SpaceBooking {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'tenant_id' })
  tenantId: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ name: 'room_id' })
  roomId: number

  @Column({ name: 'book_date', type: 'date' })
  bookDate: string

  @Column({ name: 'start_time', type: 'time' })
  startTime: string

  @Column({ name: 'end_time', type: 'time' })
  endTime: string

  @Column({ name: 'time_slot', length: 20, nullable: true })
  timeSlot: string

  @Column({ length: 100, nullable: true })
  title: string

  @Column({ length: 200, nullable: true })
  purpose: string

  @Column({ length: 20, default: 'pending' })
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => MeetingRoom)
  @JoinColumn({ name: 'room_id' })
  room: MeetingRoom
}