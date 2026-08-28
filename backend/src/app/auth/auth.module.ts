import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entites/account.entity';
import { Session } from './entites/session.entity';
import { Verification } from './entites/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Session, Verification])],
})
export class AuthModule {}
