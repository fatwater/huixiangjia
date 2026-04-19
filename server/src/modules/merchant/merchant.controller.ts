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
import { MerchantService } from './merchant.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('merchants')
@UseGuards(JwtAuthGuard)
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Get()
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
  async getMyFavorites(@Query('user_id') userId: number) {
    return this.merchantService.getMyFavorites(userId)
  }

  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    return this.merchantService.getMerchantById(+id)
  }

  @Post(':id/favorite')
  async favorite(
    @Param('id') id: string,
    @Body('user_id') userId: number,
  ) {
    return this.merchantService.favorite(userId, +id)
  }

  @Delete(':id/favorite')
  async unfavorite(
    @Param('id') id: string,
    @Body('user_id') userId: number,
  ) {
    return this.merchantService.unfavorite(userId, +id)
  }

  @Post()
  async create(@Body() data: any) {
    return this.merchantService.create(data)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.merchantService.update(+id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.merchantService.delete(+id)
  }
}
