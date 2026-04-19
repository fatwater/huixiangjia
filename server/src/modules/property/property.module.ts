import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeetingRoom } from './entities/meeting-room.entity'
import { SpaceBooking } from './entities/booking.entity'
import { PropertyService } from './property.service'
import { PropertyController } from './property.controller'

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom, SpaceBooking])],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}