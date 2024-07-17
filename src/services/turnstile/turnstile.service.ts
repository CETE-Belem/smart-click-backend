import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

type TurnstileResponseTypes = {
  success: boolean;
  'error-codes': number[];
  challenge_ts: Date;
  hostname: string;
};

@Injectable()
export class TurnstileService {
  public async validateToken(token: string): Promise<void> {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      },
    );

    const responseData: TurnstileResponseTypes = response.data;

    if (!responseData.success) {
      throw new ForbiddenException('Captcha inválido');
    }
  }
}
