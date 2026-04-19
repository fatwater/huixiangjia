import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PropertyService } from './property.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('property')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get('meeting-rooms')
  async getMeetingRooms(
    @Query('tenant_id') tenantId: number,
    @Query('date') date?: string,
  ) {
    return this.propertyService.getMeetingRooms(tenantId, date)
  }

  @Get('meeting-rooms/:id')
  async getMeetingRoomById(@Param('id') id: string) {
    return this.propertyService.getMeetingRoomById(+id)
  }

  @Post('meeting-rooms')
  async createMeetingRoom(@Body() data: any) {
    return this.propertyService.createMeetingRoom(data)
  }

  @Put('meeting-rooms/:id')
  async updateMeetingRoom(@Param('id') id: string, @Body() data: any) {
    return this.propertyService.updateMeetingRoom(+id, data)
  }

  @Delete('meeting-rooms/:id')
  async deleteMeetingRoom(@Param('id') id: string) {
    return this.propertyService.deleteMeetingRoom(+id)
  }

  @Get('bookings')
  async getMyBookings(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.propertyService.getMyBookings(userId, status)
  }

  @Post('bookings')
  async createBooking(@Body() data: any) {
    return this.propertyService.createBooking(data)
  }

  @Delete('bookings/:id')
  async cancelBooking(@Param('id') id: string) {
    return this.propertyService.cancelBooking(+id)
  }
}