import { Controller, Get, Put, Body, Request, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      primaryRole: user.primaryRole,
      secondaryRoles: user.secondaryRoles,
      isProfileComplete: user.isProfileComplete,
      verificationStatus: user.verificationStatus,
      bio: user.bio,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      instagram: user.instagram,
      telegram: user.telegram,
      playerProfile: user.playerProfile,
      coachProfile: user.coachProfile,
      refereeProfile: user.refereeProfile,
      manufacturerProfile: user.manufacturerProfile,
      installerProfile: user.installerProfile,
      sellerProfile: user.sellerProfile,
    };
  }

  @Get('public/:id')
  async getPublicProfile(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('کاربر پیدا نشد');
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      primaryRole: user.primaryRole,
      secondaryRoles: user.secondaryRoles,
      verificationStatus: user.verificationStatus,
      bio: user.bio,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
      instagram: user.instagram,
      telegram: user.telegram,
      playerProfile: user.playerProfile,
      coachProfile: user.coachProfile,
      refereeProfile: user.refereeProfile,
      manufacturerProfile: user.manufacturerProfile,
      installerProfile: user.installerProfile,
      sellerProfile: user.sellerProfile,
      createdAt: user.createdAt,
    };
  }

  @Get('by-role/:role')
  async getByRole(@Param('role') role: string) {
    return this.userService.findByRole(role);
  }

  @Put('profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Request() req: any, @Body() body: any) {
    const user = await this.userService.updateProfile(req.user.id, body);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      primaryRole: user.primaryRole,
      secondaryRoles: user.secondaryRoles,
      isProfileComplete: user.isProfileComplete,
      verificationStatus: user.verificationStatus,
      bio: user.bio,
      city: user.city,
      country: user.country,
      avatar: user.avatar,
    };
  }
}