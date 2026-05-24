import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../modules/auth/jwt/jwt.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
@UseGuards(JwtGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  @Get('my')
  getMyBookings(@Request() req) {
    return this.bookingsService.findByUser(req.user.id);
  }

  @Get('club/:clubId')
  getClubBookings(@Param('clubId') clubId: string) {
    return this.bookingsService.findByClub(clubId);
  }

  @Get('slots')
  getBookedSlots(
    @Query('clubId')  clubId: string,
    @Query('tableId') tableId: string,
    @Query('date')    date: string,
  ) {
    return this.bookingsService.getBookedSlots(clubId, tableId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancel(id, req.user.id);
  }
}