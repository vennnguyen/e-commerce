import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { apiNotFound } from 'src/shared/helpers/api-i18n';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async verifyUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      apiNotFound('errors.common.userNotFound');
    }
    return this.userRepository.update(
      {
        id: user.id,
      },
      {
        emailVerified: true,
      },
    );
  }
  getUser(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }
}
