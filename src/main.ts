import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/http-exceiption.filter';
import { AppModule } from './modules/app.module';
import { name, version, description } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Cookie 파싱 처리
  // app.use(cookieParser());

  // Mongo DB 연동 처리
  app.useGlobalPipes(new ValidationPipe());

  // 전역 예외처리
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 문서 적용
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();
  app.setGlobalPrefix('v1');
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/docs', app, document, {
    customSiteTitle: name,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  // 앱 포트 적용
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
