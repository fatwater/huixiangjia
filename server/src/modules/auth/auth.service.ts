import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch {
      throw new UnauthorizedException('Token 无效')
    }
  }
}
