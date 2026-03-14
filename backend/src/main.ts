import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS TOTAL: Esto elimina cualquier bloqueo del navegador
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  
  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Servidor listo en: http://localhost:3000/api`);

 /* const app = await await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('TaskBoard API')
    .setDescription('Documentación de la API de Tareas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Aquí defines la ruta. Si pones 'api', entrarás en localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);*/
}
bootstrap();