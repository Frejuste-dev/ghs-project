import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS')?.split(',') || [
      'http://localhost:3000',
      'http://localhost:80',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('GHS API')
    .setDescription('API de Gestion des Heures Supplémentaires')
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints d\'authentification')
    .addTag('Services', 'Gestion des services')
    .addTag('Employees', 'Gestion des employés')
    .addTag('Accounts', 'Gestion des comptes')
    .addTag('Requests', 'Gestion des demandes d\'heures supplémentaires')
    .addTag('Delegations', 'Gestion des délégations')
    .addTag('Workflows', 'Gestion des workflows')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'GHS API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.get('NODE_ENV'),
    });
  });

  const port = configService.get('APP_PORT') || 8000;
  const host = configService.get('APP_HOST') || '0.0.0.0';

  await app.listen(port, host);

  logger.log(`🚀 Application démarrée sur http://${host}:${port}`);
  logger.log(`📚 Documentation Swagger: http://${host}:${port}/docs`);
  logger.log(`❤️  Health check: http://${host}:${port}/health`);
  logger.log(`🌍 Environnement: ${configService.get('NODE_ENV')}`);
}

bootstrap();