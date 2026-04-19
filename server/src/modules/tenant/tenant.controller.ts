import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { TenantService } from './tenant.service'
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto'

@ApiTags('租户管理')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOperation({ summary: '创建租户' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '获取租户列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    return this.tenantService.findAll(+page, +pageSize)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取租户详情' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tenantService.findOne(id)
  }

  @Get('code/:shortCode')
  @ApiOperation({ summary: '根据短码获取租户' })
  findByShortCode(@Param('shortCode') shortCode: string) {
    return this.tenantService.findByShortCode(shortCode)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新租户' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTenantDto) {
    return this.tenantService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除租户' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tenantService.remove(id)
  }
}
