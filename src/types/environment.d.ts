declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      DATABASE_URL: string;
      DATABASE_MONGODB_URL: string;
      FRONTEND_URL: string;
      API_KEY: string;
      JWT_PUBLIC_KEY: string;
      JWT_PRIVATE_KEY: string;
      JWT_EXPIRATION: string;
      JWT_REMEMBER_EXPIRATION: string;
      MQTT_URL: string;
      MQTT_PORT: number;
      MQTT_USERNAME: string;
      MQTT_PASSWORD: string;
      MQTT_CLIENT_ID: string;
      TZ: string;
      BACKEND_URL: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      HOST: string;
      PROTOCOL: string;
      TURNSTILE_SECRET_KEY: string;
    }
  }
}

export {};
