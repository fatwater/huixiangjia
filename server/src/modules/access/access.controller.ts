import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { AccessService } from './access.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('公司门禁')
@ApiBearerAuth()
@Controller('access')
@UseGuards(JwtAuthGuard)
export class AccessController {
  constructor(private accessService: AccessService) {}

  @Post('visitors')
  @ApiOperation({ summary: '创建访客预约' })
  async createVisitor(@Body() data: any) {
    return this.accessService.createVisitor(data)
  }

  @Get('visitors')
  @ApiOperation({ summary: '获取我的访客预约' })
  @ApiQuery({ name: 'user_id', required: true, type: Number })
  @ApiQuery({ name: 'status', required: false })
  async getMyVisitors(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.accessService.getMyVisitors(userId, status)
  }

  @Get('visitors/:id/code')
  @ApiOperation({ summary: '获取通行码' })
  async getAccessCode(@Param('id') id: string) {
    return this.accessService.getAccessCode(+id)
  }

  @Get('records')
  @ApiOperation({ summary: '获取通行记录' })
  @ApiQuery({ name: 'user_id', required: false, type: Number })
  @ApiQuery({ name: 'start_date', required: false })
  @ApiQuery({ name: 'end_date', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
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
