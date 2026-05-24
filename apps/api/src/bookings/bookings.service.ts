import {
  Injectable, NotFoundException,
  ConflictException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  // ─── Create ──────────────────────────────────────────────
  async create(userId: string, dto: CreateBookingDto): Promise<Booking> {
    // Check for conflicting bookings on same table/date/slots
    const conflict = await this.bookingRepo
  .createQueryBuilder('b')
  .where('b.clubId = :clubId', { clubId: dto.clubId })
  .andWhere('b.tableId = :tableId', { tableId: dto.tableId })
  .andWhere('b.bookingDate = :date', { date: dto.bookingDate })
  .andWhere('b.status != :cancelled', { cancelled: BookingStatus.CANCELLED })
  .getMany();

    if (conflict.length > 0) {
      const bookedSlots = conflict.flatMap(b => b.timeSlots);
      const overlap = dto.timeSlots.filter(s => bookedSlots.includes(s));
      if (overlap.length > 0) {
        throw new ConflictException(
          `ساعت‌های ${overlap.join(', ')} قبلاً رزرو شده است`,
        );
      }
    }

    const booking = this.bookingRepo.create({
      userId,
      clubId:    dto.clubId,
      tableId:   dto.tableId,
      tableBrand: dto.tableBrand,
      tableType:  dto.tableType,
      bookingDate: dto.bookingDate,
      timeSlots:  dto.timeSlots,
      totalHours: dto.totalHours,
      totalPrice: dto.totalPrice,
      gateway:    dto.gateway,
      notes:      dto.notes,
      status:     BookingStatus.PENDING,
    });

    return this.bookingRepo.save(booking);
  }

  // ─── Get user bookings ────────────────────────────────────
  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Get club bookings (club owner / admin) ───────────────
  async findByClub(clubId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { clubId },
      order: { bookingDate: 'ASC', createdAt: 'ASC' },
    });
  }

  // ─── Get booked slots for a table on a date ───────────────
  async getBookedSlots(
    clubId: string,
    tableId: string,
    date: string,
  ): Promise<string[]> {
    const bookings = await this.bookingRepo.find({
      where: {
        clubId,
        tableId,
        bookingDate: date,
        status: BookingStatus.CONFIRMED,
      },
    });
    return bookings.flatMap(b => b.timeSlots);
  }

  // ─── Get single booking ───────────────────────────────────
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('رزرو یافت نشد');
    return booking;
  }

  // ─── Update (admin / internal) ────────────────────────────
  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    return this.bookingRepo.save(booking);
  }

  // ─── Cancel (user cancels own booking) ───────────────────
  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException('فقط صاحب رزرو می‌تواند آن را لغو کند');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException('این رزرو قبلاً لغو شده است');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException('رزرو تکمیل‌شده قابل لغو نیست');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }

  // ─── Confirm after payment (internal use) ─────────────────
  async confirm(id: string, paymentId: string, gateway: string): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.status    = BookingStatus.CONFIRMED;
    booking.paymentId = paymentId;
    booking.gateway   = gateway;
    return this.bookingRepo.save(booking);
  }
}