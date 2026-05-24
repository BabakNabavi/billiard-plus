import {
  IsString, IsArray, IsNumber,
  IsDateString, IsOptional, ArrayMinSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  clubId: string;

  @IsString()
  tableId: string;

  @IsOptional()
  @IsString()
  tableBrand?: string;

  @IsOptional()
  @IsString()
  tableType?: string;

  @IsDateString()
  bookingDate: string; // YYYY-MM-DD

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  timeSlots: string[]; // ["10:00", "11:00", "12:00"]

  @IsNumber()
  totalHours: number;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}