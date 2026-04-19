import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '企业微信登录' })
  async login(@Body() body: { code: string }) {
    return this.authService.login(body.code)
  }

  @Post('admin/login')
  @ApiOperation({ summary: '管理后台登录' })
  async adminLogin(@Body() body: { username: string; password: string }) {
    return this.authService.adminLogin(body.username, body.password)
  }

  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  async getUserInfo(@CurrentUser() user: any) {
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/userinfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取管理员信息' })
  async getAdminUserInfo(@CurrentUser() user: any) {
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '登出' })
  async logout() {
    return { success: true }
  }
}
