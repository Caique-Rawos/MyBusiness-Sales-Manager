import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { Public } from './decorators/public.decorator';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Login (e-mail + senha)' })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto.email, dto.senha);
    this.setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      usuario: result.usuario,
      tenant: result.tenant,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Renovar access token via refresh token (cookie httpOnly)' })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      throw new UnauthorizedException('Refresh token não informado');
    }

    const result = await this.authService.refresh(token);
    this.setRefreshCookie(res, result.refreshToken);
    return {
      accessToken: result.accessToken,
      usuario: result.usuario,
      tenant: result.tenant,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Logout (revoga o refresh token atual)' })
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (token) {
      await this.authService.logout(token);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
    return { success: true };
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      path: '/auth',
    });
  }
}
