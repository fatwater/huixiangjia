import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('数据统计')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取平台统计数据' })
  getStats() {
    return this.dashboardService.getStats()
  }

  @Get('tenant')
  @ApiOperation({ summary: '获取租户统计数据' })
  @ApiQuery({ name: 'tenant_id', required: true, type: Number })
  getTenantStats(@Query('tenant_id') tenantId: number) {
    return this.dashboardService.getTenantStats(tenantId)
  }
}
