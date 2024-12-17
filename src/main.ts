import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
// import { WinstonModule } from 'nest-winston';
// import { winstonConfig } from './config/winston.config';
import helmet from 'helmet';
import { APIGuard } from './common/guards/api.guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  ////////////// REMOVENDO LOGS VERCEL //////////////////////
  // const app = await NestFactory.create(AppModule, {
  //   logger: WinstonModule.createLogger(winstonConfig),
  // });
  /////////////////////////////////////////////////////////

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalGuards(new APIGuard());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Smart Click API Documentation')
    .setDescription('Documentation for the Smart Click API documentation')
    .setVersion('0.1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'Api-Key',
      },
      'Api-Key',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //const { httpAdapter } = app.get(HttpAdapterHost);

  await app.listen(3000);
}
bootstrap();
