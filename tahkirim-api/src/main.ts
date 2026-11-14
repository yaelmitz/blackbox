import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  // Vite dev server (5173) and preview (4173) by default
  app.enableCors({ origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173').split(',') });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('BLACKBOX API')
    .setDescription('תחקירים, המלצות, לקחים, משימות ופרמטרים')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  Logger.log(`Database: ${process.env.DB_TYPE === 'postgres' ? 'PostgreSQL' : 'SQLite file'}`, 'Bootstrap');
  Logger.log(`API on http://localhost:${port}/api - docs on http://localhost:${port}/api/docs`, 'Bootstrap');
}
bootstrap();
