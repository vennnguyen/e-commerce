import { registerAs } from '@nestjs/config';
import { parseEnvOrigins } from 'src/shared/utils/parse-env-origin';

export const APP_CONFIG = 'app';

export default registerAs(APP_CONFIG, () => {
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('CORS_OTHER_URL:', process.env.CORS_OTHER_URL);
  return {
    port: parseInt(process.env.PORT, 10) || 8080,
    corsOrigin: parseEnvOrigins(
      process.env.CLIENT_URL,
      process.env.CORS_OTHER_URL,
    ),
  };
});
