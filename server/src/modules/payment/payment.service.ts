import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import axios from 'axios'

@Injectable()
export class PaymentService {
  private readonly mchId: string
  private readonly mchKey: string
  private readonly appId: string
  private readonly notifyUrl: string

  constructor(private configService: ConfigService) {
    this.mchId = this.configService.get('wepay.mchId') || ''
    this.mchKey = this.configService.get('wepay.mchKey') || ''
    this.appId = this.configService.get('wepay.appId') || ''
    this.notifyUrl = this.configService.get('wepay.notifyUrl') || ''
  }

  /**
   * 统一下单
   */
  async unifiedOrder(params: {
    orderNo: string
    amount: number // 金额，单位：分
    description: string
    openid: string
  }) {
    const { orderNo, amount, description, openid } = params

    // 如果未配置微信支付，返回模拟支付成功
    if (!this.mchId || !this.mchKey) {
      return {
        success: true,
        mock: true,
        message: '支付功能模拟成功',
        orderNo,
      }
    }

    const nonceStr = this.generateNonceStr()
    const timestamp = Math.floor(Date.now() / 1000).toString()

    const payload = {
      appid: this.appId,
      mch_id: this.mchId,
      nonce_str: nonceStr,
      body: description,
      out_trade_no: orderNo,
      total_fee: amount,
      spbill_create_ip: '127.0.0.1',
      notify_url: this.notifyUrl,
      trade_type: 'JSAPI',
      openid: openid,
    }

    // 生成签名
    payload['sign'] = this.generateSign(payload)

    try {
      const response = await axios.post(
        'https://api.mch.weixin.qq.com/pay/unifiedorder',
        this.arrayToXml(payload),
        {
          headers: { 'Content-Type': 'text/xml' },
        },
      )

      const result = this.xmlToArray(response.data)

      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        // 返回支付参数给前端
        const paySign = this.generateJsApiSign({
          appId: this.appId,
          timeStamp: timestamp,
          nonceStr: nonceStr,
          package: `prepay_id=${result.prepay_id}`,
          signType: 'MD5',
        })

        return {
          success: true,
          orderNo,
          prepayId: result.prepay_id,
          payParams: {
            appId: this.appId,
            timeStamp: timestamp,
            nonceStr: nonceStr,
            package: `prepay_id=${result.prepay_id}`,
            signType: 'MD5',
            paySign,
          },
        }
      } else {
        return {
          success: false,
          error: result.err_code_des || result.return_msg,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: '微信支付请求失败',
      }
    }
  }

  /**
   * 支付回调处理
   */
  async handleNotify(data: any) {
    const { xmlData } = data

    // 验证签名
    const sign = xmlData.sign
    delete xmlData.sign

    if (this.generateSign(xmlData) !== sign) {
      return { return_code: 'FAIL', return_msg: '签名验证失败' }
    }

    if (xmlData.return_code === 'SUCCESS' && xmlData.result_code === 'SUCCESS') {
      // 支付成功，处理订单
      const orderNo = xmlData.out_trade_no
      const transactionId = xmlData.transaction_id

      // 这里应该更新订单状态
      // await this.orderService.updatePayStatus(orderNo, transactionId)

      return {
        return_code: 'SUCCESS',
        return_msg: 'OK',
      }
    }

    return { return_code: 'FAIL', return_msg: '支付失败' }
  }

  /**
   * 查询订单
   */
  async queryOrder(orderNo: string) {
    if (!this.mchId) {
      return { success: true, mock: true, status: 'PAID' }
    }

    const nonceStr = this.generateNonceStr()

    const payload = {
      appid: this.appId,
      mch_id: this.mchId,
      out_trade_no: orderNo,
      nonce_str: nonceStr,
    }

    payload['sign'] = this.generateSign(payload)

    try {
      const response = await axios.post(
        'https://api.mch.weixin.qq.com/pay/orderquery',
        this.arrayToXml(payload),
        { headers: { 'Content-Type': 'text/xml' } },
      )

      const result = this.xmlToArray(response.data)

      if (result.trade_state === 'SUCCESS') {
        return { success: true, status: 'PAID', transactionId: result.transaction_id }
      } else {
        return { success: true, status: result.trade_state || 'UNKNOWN' }
      }
    } catch (error) {
      return { success: false, error: '查询失败' }
    }
  }

  /**
   * 申请退款
   */
  async refund(orderNo: string, refundAmount: number) {
    if (!this.mchId) {
      return { success: true, mock: true }
    }

    const nonceStr = this.generateNonceStr()

    const payload = {
      appid: this.appId,
      mch_id: this.mchId,
      out_trade_no: orderNo,
      out_refund_no: `REF${orderNo}`,
      total_fee: 1, // 实际金额
      refund_fee: refundAmount,
      nonce_str: nonceStr,
    }

    payload['sign'] = this.generateSign(payload)

    try {
      const response = await axios.post(
        'https://api.mch.weixin.qq.com/secapi/pay/refund',
        this.arrayToXml(payload),
        { headers: { 'Content-Type': 'text/xml' } },
      )

      const result = this.xmlToArray(response.data)

      return {
        success: result.return_code === 'SUCCESS',
        refundId: result.refund_id,
      }
    } catch (error) {
      return { success: false, error: '退款失败' }
    }
  }

  // 工具方法

  private generateNonceStr(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private generateSign(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .filter((k) => params[k])
      .map((k) => `${k}=${params[k]}`)
      .join('&')

    return crypto
      .createHash('md5')
      .update(`${sorted}&key=${this.mchKey}`)
      .digest('hex')
      .toUpperCase()
  }

  private generateJsApiSign(params: Record<string, any>): string {
    const sorted = Object.keys(params)
      .sort()
      .filter((k) => params[k])
      .map((k) => `${k}=${params[k]}`)
      .join('&')

    return crypto
      .createHash('md5')
      .update(`${sorted}&key=${this.mchKey}`)
      .digest('hex')
      .toUpperCase()
  }

  private arrayToXml(params: Record<string, any>): string {
    let xml = '<xml>'
    for (const [key, value] of Object.entries(params)) {
      xml += `<${key}><![CDATA[${value}]]></${key}>`
    }
    xml += '</xml>'
    return xml
  }

  private xmlToArray(xml: string): Record<string, any> {
    const result: Record<string, any> = {}
    const matches = xml.match(/<(\w+)><!\[CDATA\[([^\]]+)\]\]><\/\1>/g)

    if (matches) {
      for (const match of matches) {
        const [, key, value] = match.match(/<(\w+)><!\[CDATA\[([^\]]+)\]\]><\/\1>/) || []
        if (key) {
          result[key] = value
        }
      }
    }

    return result
  }
}
