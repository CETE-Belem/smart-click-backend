import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z
    .string({
      message: 'DATABASE_URL is required in .env',
    })
    .url({
      message: 'DATABASE_URL must be a valid URL',
    }),
  TZ: z.string({
    message: 'TZ is required in .env',
  }),
  NODE_ENV: z.enum(['production', 'development', 'test'], {
    message: 'NODE_ENV must be one of "production", "development" or "test"',
  }),
  FRONTEND_URL: z
    .string({
      message: 'FRONTEND_URL is required in .env',
    })
    .url({
      message: 'FRONTEND_URL must be a valid URL',
    }),
  BACKEND_URL: z
    .string({
      message: 'BACKEND_URL is required in .env',
    })
    .url({
      message: 'BACKEND_URL must be a valid URL',
    }),
  API_KEY: z.string({
    message: 'API_KEY is required in .env',
  }),
  SMTP_HOST: z.string({
    message: 'SMTP_HOST is required in .env',
  }),
  SMTP_PORT: z.string({
    message: 'SMTP_PORT is required in .env',
  }),
  SMTP_USER: z.string({
    message: 'SMTP_USER is required in .env',
  }),
  SMTP_PASSWORD: z.string({
    message: 'SMTP_PASSWORD is required in .env',
  }),
  HOST: z.string({
    message: 'HOST is required in .env',
  }),
  PROTOCOL: z.string({
    message: 'PROTOCOL is required in .env',
  }),
  TURNSTILE_SECRET_KEY: z.string({
    message: 'TURNSTILE_SECRET_KEY is required in .env',
  }),
  MQTT_PORT: z.string({
    message: 'MQTT_PORT is required in .env',
  }),
  MQTT_URL: z.string({
    message: 'MQTT_URL is required in .env',
  }),
  MQTT_USERNAME: z.string({
    message: 'MQTT_USERNAME is required in .env',
  }),
  MQTT_PASSWORD: z.string({
    message: 'MQTT_PASSWORD is required in .env',
  }),
  MQTT_CLIENT_ID: z.string({
    message: 'MQTT_CLIENT_ID is required in .env',
  }),
  JWT_EXPIRATION: z.string({
    message: 'JWT_EXPIRATION is required in .env',
  }),
  JWT_REMEMBER_EXPIRATION: z.string({
    message: 'JWT_REMEMBER_EXPIRATION is required in .env',
  }),
  JWT_PUBLIC_KEY: z.string({
    message: 'JWT_PUBLIC_KEY is required in .env',
  }),
  JWT_PRIVATE_KEY: z.string({
    message: 'JWT_PRIVATE_KEY is required in .env',
  }),
});

export const env = envSchema.parse(process.env);
