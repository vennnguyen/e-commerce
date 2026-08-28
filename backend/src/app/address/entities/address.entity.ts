import { User } from 'src/app/user/entities/user.entity';
import { BaseUuidEntity } from 'src/config/database/base-uuid.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@Index('user_default_address', ['user_id'], {
  unique: true,
  where: '"is_default" = true AND "deleted_at" IS NULL',
})
export class Address extends BaseUuidEntity {
  @Index()
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 20 })
  full_name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 225 })
  address_line1: string;

  @Column({ type: 'varchar', length: 225, nullable: true })
  address_line2: string | null;

  @Column({ type: 'varchar', length: 20 })
  ward: string;

  @Column({ type: 'varchar', length: 20 })
  district: string;

  @Column({ type: 'varchar', length: 20 })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code: string;

  @Column({ default: false })
  isDefault: boolean;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  //relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
