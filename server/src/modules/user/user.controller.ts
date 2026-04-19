import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { PaginationDto } from '../../common/dto/pagination.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Query() query: PaginationDto & { tenant_id?: number }) {
    return this.userService.findByTenant(query.tenant_id, query.page, query.pageSize)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(+id)
  }

  @Post()
  async create(@Body() data: any) {
    return this.userService.create(data)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id)
  }
}
