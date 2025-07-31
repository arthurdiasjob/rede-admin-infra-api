import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar limite do body parser (10MB para imagens base64)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Configurar validações globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS com configurações para desenvolvimento e produção
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://seu-frontend.vercel.app', 'https://seu-dominio.com'] // Adicione seus domínios de produção
        : ['http://localhost:3001', 'http://localhost:3000'], // Desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Permitir cookies e headers de autenticação
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API Rede')
    .setDescription('API para gerenciar usuários e notícias')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Operações relacionadas aos usuários')
    .addTag('news', 'Operações relacionadas às notícias')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurar timeout do servidor (5 minutos para uploads grandes)
  const port = process.env.PORT || 3000;
  const server = await app.listen(port);
  server.setTimeout(300000); // 5 minutos
  console.log(`🚀 API rodando na porta ${port}`);
  console.log(
    `📖 Documentação Swagger: ${process.env.NODE_ENV === 'production' ? 'https://sua-api.railway.app' : `http://localhost:${port}`}/api`,
  );
  console.log('📚 Rotas disponíveis:');
  console.log('   POST   /auth/login');
  console.log('   GET    /users (🔒 JWT)');
  console.log('   POST   /users (🔒 JWT)');
  console.log('   GET    /users/:id (🔒 JWT)');
  console.log('   PATCH  /users/:id (🔒 JWT)');
  console.log('   DELETE /users/:id (🔒 JWT)');
  console.log('   GET    /news');
  console.log('   POST   /news (🔒 JWT)');
  console.log('   GET    /news/:id');
  console.log('   PATCH  /news/:id (🔒 JWT)');
  console.log('   DELETE /news/:id (🔒 JWT)');
}
bootstrap();
