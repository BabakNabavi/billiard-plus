import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Request() req: any) {
    return req.user;
  }
}