import { timingSafeEqual } from 'crypto';

export function verifyInternalSecret(
  provided: string | undefined | null,
  expected: string | undefined | null,
): boolean {
  const received = provided?.trim();
  const configured = expected?.trim();

  if (!received || !configured) return false;

  const receivedBuf = new Uint8Array(Buffer.from(received, 'utf8'));

  const configuredBuf = new Uint8Array(Buffer.from(configured, 'utf8'));

  if (receivedBuf.length !== configuredBuf.length) {
    return false;
  }

  return timingSafeEqual(receivedBuf, configuredBuf);
}
