import type { FastifyBaseLogger } from 'fastify'

export async function sendOtpMock(logger: FastifyBaseLogger, phoneE164: string, code: string): Promise<void> {
  logger.info({ phoneE164 }, `Sending OTP ${code} to ${phoneE164}`)
}
