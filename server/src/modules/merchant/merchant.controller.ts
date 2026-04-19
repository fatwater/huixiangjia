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
import { MerchantService } from './merchant.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('周边商家')
@ApiBearerAuth()
@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
  @ApiOperation({ summary: '获取商家列表' })
  @ApiQuery({ name: 'tenant_id', required: true, type: Number })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getMerchants(
    @Query('tenant_id') tenantId: number,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.merchantService.getMerchants(tenantId, keyword, category, page, pageSize)
  }

  @Get('favorites')
  @ApiOperation({ summary: '获取我的收藏' })
  @ApiQuery({ name: 'user_id', required: true, type: Number })
  async getMyFavorites(@Query('user_id') userId: number) {
    return this.merchantService.getMyFavorites(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商家详情' })
  async getMerchantById(@Param('id') id: string) {
    return this.merchantService.getMerchantById(+id)
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: '收藏商家' })
  async favorite(@Param('id') id: string, @Body('user_id') userId: number) {
    return this.merchantService.favorite(userId, +id)
  }

  @Delete(':id/favorite')
  @ApiOperation({ summary: '取消收藏' })
  async unfavorite(@Param('id') id: string, @Body('user_id') userId: number) {
    return this.merchantService.unfavorite(userId, +id)
  }

  @Post()
  @ApiOperation({ summary: '创建商家' })
  async create(@Body() data: any) {
    return this.merchantService.create(data)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商家' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.merchantService.update(+id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商家' })
  async delete(@Param('id') id: string) {
    return this.merchantService.delete(+id)
  }
}
