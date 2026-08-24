import { registerAs } from '@nestjs/config';

export const THROTTLER_CONFIG = 'throttler';

export default registerAs(THROTTLER_CONFIG, () => ({
  // registerAS chạy trước configService nên ko thể dùng dependency injection để lấy configService, nên phải dùng process.env
  ttl: parseInt(process.env.THROTTLER_TTL_MS || '1000', 10),
  limit: parseInt(process.env.THROTTLER_LIMIT || '60', 10),
}));
