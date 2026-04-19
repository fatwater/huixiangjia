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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { PropertyService } from './property.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('物业会议室')
@ApiBearerAuth()
@Controller('property')
@UseGuards(JwtAuthGuard)
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get('meeting-rooms')
  @ApiOperation({ summary: '获取会议室列表' })
  @ApiQuery({ name: 'tenant_id', required: true, type: Number })
  @ApiQuery({ name: 'date', required: false, type: String })
  async getMeetingRooms(
    @Query('tenant_id') tenantId: number,
    @Query('date') date?: string,
  ) {
    return this.propertyService.getMeetingRooms(tenantId, date)
  }

  @Get('meeting-rooms/:id')
  @ApiOperation({ summary: '获取会议室详情' })
  async getMeetingRoomById(@Param('id') id: string) {
    return this.propertyService.getMeetingRoomById(+id)
  }

  @Post('meeting-rooms')
  @ApiOperation({ summary: '创建会议室' })
  async createMeetingRoom(@Body() data: any) {
    return this.propertyService.createMeetingRoom(data)
  }

  @Put('meeting-rooms/:id')
  @ApiOperation({ summary: '更新会议室' })
  async updateMeetingRoom(@Param('id') id: string, @Body() data: any) {
    return this.propertyService.updateMeetingRoom(+id, data)
  }

  @Delete('meeting-rooms/:id')
  @ApiOperation({ summary: '删除会议室' })
  async deleteMeetingRoom(@Param('id') id: string) {
    return this.propertyService.deleteMeetingRoom(+id)
  }

  @Get('bookings')
  @ApiOperation({ summary: '获取我的预约' })
  @ApiQuery({ name: 'user_id', required: true, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getMyBookings(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.propertyService.getMyBookings(userId, status)
  }

  @Post('bookings')
  @ApiOperation({ summary: '创建会议室预约' })
  async createBooking(@Body() data: any) {
    return this.propertyService.createBooking(data)
  }

  @Delete('bookings/:id')
  @ApiOperation({ summary: '取消预约' })
  async cancelBooking(@Param('id') id: string) {
    return this.propertyService.cancelBooking(+id)
  }
}