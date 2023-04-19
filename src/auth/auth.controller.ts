import { UserDto } from '@/Dtos/UserDto';
import {
  Controller,
  Req,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req,
    @Body() user: UserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(res, req, user.password);
  }

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Req() req,
    @Body() user: UserDto
  ) {
    return this.authService.register(user, res, req);
  }

  @Get('refresh')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    return this.authService.refreshToken(res, req);
  }
}
