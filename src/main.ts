import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ 
    origin: true, 
    credentials: true 
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger com suporte a Bearer Token para testar rotas protegidas
  const config = new DocumentBuilder()
    .setTitle('CineWeb API')
    .setDescription('API do ecossistema CineWeb — Gerenciamento de cinema com autenticação JWT')
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o Access Token JWT',
      },
      'access-token',
    )
    .build();
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🎬 CineWeb API rodando em: http://0.0.0.0:${port}`);
  console.log(`📚 Swagger UI disponível em: http://0.0.0.0:${port}/api`);
}
bootstrap();