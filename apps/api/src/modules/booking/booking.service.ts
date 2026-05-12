import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus, TableType } from './booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource,
  ) {}

  async create(data: {
    clubId: string;
    userId: string;
    tableType: TableType;
    tableNumber: number;
    startTime: Date;
    endTime: Date;
    totalPrice?: number;
    currency?: string;
    notes?: string;
  }): Promise<Booking> {
    return this.dataSource.transaction(async (manager) => {
      // بررسی double-booking با Pessimistic Lock
      const existing = await manager
        .createQueryBuilder(Booking, 'booking')
        .where('booking.clubId = :clubId', { clubId: data.clubId })
        .andWhere('booking.tableNumber = :tableNumber', { tableNumber: data.tableNumber })
        .andWhere('booking.status NOT IN (:...statuses)', {
          statuses: [BookingStatus.CANCELLED],
        })
        .andWhere(
          '(booking.startTime < :endTime AND booking.endTime > :startTime)',
          { startTime: data.startTime, endTime: data.endTime },
        )
        .setLock('pessimistic_write')
        .getOne();

      if (existing) {
        throw new BadRequestException('این میز در این بازه زمانی رزرو شده است');
      }

      const booking = manager.create(Booking, {
        ...data,
        status: BookingStatus.PENDING,
        currency: data.currency || 'IRR',
      });

      return manager.save(booking);
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['club', 'user'],
    });
    if (!booking) {
      throw new NotFoundException('رزرو پیدا نشد');
    }
    return booking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['club'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByClub(clubId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { clubId },
      relations: ['user'],
      order: { startTime: 'ASC' },
    });
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.findById(id);
    booking.status = status;
    return this.bookingRepository.save(booking);
  }

  async checkAvailability(
    clubId: string,
    tableNumber: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const existing = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.clubId = :clubId', { clubId })
      .andWhere('booking.tableNumber = :tableNumber', { tableNumber })
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CANCELLED],
      })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime },
      )
      .getOne();

    return !existing;
  }
}