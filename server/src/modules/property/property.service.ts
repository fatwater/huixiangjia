import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MeetingRoom } from './entities/meeting-room.entity'
import { SpaceBooking } from './entities/booking.entity'

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(MeetingRoom)
    private roomRepository: Repository<MeetingRoom>,
    @InjectRepository(SpaceBooking)
    private bookingRepository: Repository<SpaceBooking>,
  ) {}

  async getMeetingRooms(tenantId: number, date?: string) {
    const rooms = await this.roomRepository.find({ where: { tenantId } })

    if (date) {
      const bookings = await this.bookingRepository.find({
        where: { tenantId, bookDate: date },
      })

      return rooms.map((room) => ({
        ...room,
        bookings: bookings.filter((b) => b.roomId === room.id),
        timeSlots: bookings
          .filter((b) => b.roomId === room.id)
          .map((b) => b.timeSlot),
      }))
    }

    return rooms
  }

  async getMeetingRoomById(id: number) {
    const room = await this.roomRepository.findOne({ where: { id } })
    if (!room) {
      throw new BadRequestException('会议室不存在')
    }

    const today = new Date().toISOString().split('T')[0]
    const bookings = await this.bookingRepository.find({
      where: { roomId: id },
      order: { bookDate: 'ASC' },
    })

    return { ...room, bookings }
  }

  async createMeetingRoom(data: Partial<MeetingRoom>): Promise<MeetingRoom> {
    const room = this.roomRepository.create(data)
    return this.roomRepository.save(room)
  }

  async updateMeetingRoom(id: number, data: Partial<MeetingRoom>): Promise<void> {
    await this.roomRepository.update(id, data)
  }

  async deleteMeetingRoom(id: number): Promise<void> {
    await this.roomRepository.delete(id)
  }

  async createBooking(data: Partial<SpaceBooking>): Promise<SpaceBooking> {
    const existing = await this.bookingRepository.findOne({
      where: {
        roomId: data.roomId,
        bookDate: data.bookDate,
        timeSlot: data.timeSlot,
        status: 'pending',
      },
    })

    if (existing) {
      throw new BadRequestException('该时段已被预约')
    }

    const booking = this.bookingRepository.create(data)
    return this.bookingRepository.save(booking)
  }

  async getMyBookings(userId: number, status?: string) {
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const bookings = await this.bookingRepository.find({
      where,
      relations: ['room'],
      order: { createdAt: 'DESC' },
    })

    return bookings.map((b) => ({
      ...b,
      status_text: { pending: '待审核', confirmed: '已通过', cancelled: '已取消' }[b.status],
    }))
  }

  async cancelBooking(id: number): Promise<void> {
    await this.bookingRepository.update(id, { status: 'cancelled' })
  }
}