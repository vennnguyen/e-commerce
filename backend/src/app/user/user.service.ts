import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async verifyUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return this.userRepository.update(
      {
        id: user.id,
      },
      {
        emailVerified: true,
      },
    );
  }
}
