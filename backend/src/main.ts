import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS TOTAL: Esto elimina cualquier bloqueo del navegador
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    // Escucha en todas las interfaces para evitar bloqueos locales
    await app.listen(3000, '0.0.0.0');
    console.log(`🚀 Servidor listo en: http://localhost:3000/api`);
}
bootstrap();