import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../modules/user/user.entity';
import { Club } from '../modules/club/club.entity';

export enum BookingStatus {
  PENDING   = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  clubId: string;

  @Column()
  tableId: string;

  @Column({ nullable: true })
  tableBrand: string;

  @Column({ nullable: true })
  tableType: string;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'simple-array' })
  timeSlots: string[];

  @Column({ type: 'int' })
  totalHours: number;

  @Column({ type: 'bigint' })
  totalPrice: number;

  @Column({ default: BookingStatus.PENDING })
  status: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  gateway: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Club, { eager: false })
  @JoinColumn({ name: 'clubId' })
  club: Club;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}