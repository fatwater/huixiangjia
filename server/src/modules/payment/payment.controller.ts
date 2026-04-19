import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentService } from './payment.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('微信支付')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('unified')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '统一下单' })
  async unifiedOrder(
    @Body()
    body: {
      orderNo: string
      amount: number
      description: string
    },
    @Req() req: any,
  ) {
    const openid = req.user?.openid || ''
    return this.paymentService.unifiedOrder({
      ...body,
      openid,
    })
  }

  @Post('notify')
  @ApiOperation({ summary: '支付回调通知' })
  async notify(@Body() body: { xmlData: Record<string, any> }) {
    return this.paymentService.handleNotify(body)
  }

  @Get('query/:orderNo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查询订单' })
  async queryOrder(@Param('orderNo') orderNo: string) {
    return this.paymentService.queryOrder(orderNo)
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '申请退款' })
  async refund(
    @Body() body: { orderNo: string; refundAmount: number },
  ) {
    return this.paymentService.refund(body.orderNo, body.refundAmount)
  }
}
