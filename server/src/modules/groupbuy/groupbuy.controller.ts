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
import { GroupbuyService } from './groupbuy.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('groupbuy')
@UseGuards(JwtAuthGuard)
export class GroupbuyController {
  constructor(private groupbuyService: GroupbuyService) {}

  @Get('products')
  async getProducts(
    @Query('tenant_id') tenantId: number,
    @Query('status') status?: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getProducts(tenantId, status, page, pageSize)
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.groupbuyService.getProductById(+id)
  }

  @Post('products')
  async createProduct(@Body() data: any) {
    return this.groupbuyService.createProduct(data)
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.groupbuyService.updateProduct(+id, data)
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.groupbuyService.deleteProduct(+id)
  }

  @Get('orders')
  async getMyOrders(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getMyOrders(userId, status, page, pageSize)
  }

  @Post('orders')
  async createOrder(@Body() data: any) {
    return this.groupbuyService.createOrder(data)
  }

  @Put('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.groupbuyService.cancelOrder(+id)
  }
}
