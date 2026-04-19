import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * 企业微信 OAuth 登录 (小程序)
   */
  async login(code: string) {
    // 企业微信 OAuth 验证
    // 这里简化处理，实际需要调用企业微信 API 获取用户信息
    const user = await this.userService.findByWxUserid(code)

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    }

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        tenantId: user.tenantId,
        role: user.role,
        avatar: user.avatar,
      },
      tenant: user.tenant ? {
        id: user.tenant.id,
        name: user.tenant.name,
        logo: user.tenant.logo,
      } : null,
    }
  }

  /**
   * 管理后台登录
   */
  async adminLogin(username: string, password: string) {
    // 查找超级管理员 (admin 角色且有 password)
    const user = await this.userService.findByPhoneAndRole(username, 'admin')

    if (!user) {
      throw new UnauthorizedException('管理员账号不存在')
    }

    // 验证密码 (简单 MD5，实际应用使用 bcrypt)
    const hashedPassword = this.hashPassword(password)
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('密码错误')
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('账号已被禁用')
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
      isAdmin: true,
    }

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        tenantId: user.tenantId,
        role: user.role,
        avatar: user.avatar,
      },
    }
  }

  /**
   * 简单密码哈希 (生产环境应使用 bcrypt)
   */
  private hashPassword(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex')
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch {
      throw new UnauthorizedException('Token 无效')
    }
  }
}
