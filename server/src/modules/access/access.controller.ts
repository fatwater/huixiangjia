import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AccessService } from './access.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('access')
@UseGuards(JwtAuthGuard)
export class AccessController {
  constructor(private accessService: AccessService) {}

  @Post('visitors')
  async createVisitor(@Body() data: any) {
    return this.accessService.createVisitor(data)
  }

  @Get('visitors')
  async getMyVisitors(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.accessService.getMyVisitors(userId, status)
  }

  @Get('visitors/:id/code')
  async getAccessCode(@Param('id') id: string) {
    return this.accessService.getAccessCode(+id)
  }

  @Get('records')
  async getAccessRecords(
    @Query('user_id') userId?: number,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.accessService.getAccessRecords(userId, startDate, endDate, page, pageSize)
  }
}
