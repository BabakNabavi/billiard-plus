import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  PLAYER = 'player',
  COACH = 'coach',
  REFEREE = 'referee',
  CLUB_OWNER = 'club_owner',
  SELLER = 'seller',
  MANUFACTURER = 'manufacturer',
  INSTALLER = 'installer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.PLAYER],
  })
  roles: UserRole[];

  @Column({ default: 'fa' })
  language: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}