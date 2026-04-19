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
import { GroupbuyService } from './groupbuy.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('公司团购')
@ApiBearerAuth()
@Controller('groupbuy')
@UseGuards(JwtAuthGuard)
export class GroupbuyController {
  constructor(private groupbuyService: GroupbuyService) {}

  @Get('products')
  @ApiOperation({ summary: '获取团购商品列表' })
  @ApiQuery({ name: 'tenant_id', required: true, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getProducts(
    @Query('tenant_id') tenantId: number,
    @Query('status') status?: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getProducts(tenantId, status, page, pageSize)
  }

  @Get('products/:id')
  @ApiOperation({ summary: '获取商品详情' })
  async getProductById(@Param('id') id: string) {
    return this.groupbuyService.getProductById(+id)
  }

  @Post('products')
  @ApiOperation({ summary: '创建团购商品' })
  async createProduct(@Body() data: any) {
    return this.groupbuyService.createProduct(data)
  }

  @Put('products/:id')
  @ApiOperation({ summary: '更新商品' })
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.groupbuyService.updateProduct(+id, data)
  }

  @Delete('products/:id')
  @ApiOperation({ summary: '删除商品' })
  async deleteProduct(@Param('id') id: string) {
    return this.groupbuyService.deleteProduct(+id)
  }

  @Get('orders')
  @ApiOperation({ summary: '获取我的订单' })
  @ApiQuery({ name: 'user_id', required: true, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getMyOrders(
    @Query('user_id') userId: number,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.groupbuyService.getMyOrders(userId, status, page, pageSize)
  }

  @Post('orders')
  @ApiOperation({ summary: '创建订单' })
  async createOrder(@Body() data: any) {
    return this.groupbuyService.createOrder(data)
  }

  @Put('orders/:id/cancel')
  @ApiOperation({ summary: '取消订单' })
  async cancelOrder(@Param('id') id: string) {
    return this.groupbuyService.cancelOrder(+id)
  }
}
