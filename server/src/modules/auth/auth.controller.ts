import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { code: string }) {
    return this.authService.login(body.code)
  }

  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  async getUserInfo(@CurrentUser() user: any) {
    return user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { success: true }
  }
}
