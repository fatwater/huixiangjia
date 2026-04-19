import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaginationDto } from '../../common/dto/pagination.dto'

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiQuery({ name: 'tenant_id', required: false, type: Number })
  async findAll(@Query() query: PaginationDto & { tenant_id?: number }) {
    return this.userService.findByTenant(query.tenant_id, query.page, query.pageSize)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id)
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() data: any) {
    return this.userService.create(data)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(+id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id)
  }
}
