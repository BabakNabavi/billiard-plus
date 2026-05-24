import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}