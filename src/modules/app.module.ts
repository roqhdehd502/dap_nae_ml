/// <reference types="node" />

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { AppController } from '../controllers/app.controller';
import * as models from '../models';
import { AuthModule } from '../modules/auth.module';
import { PostModule } from '../modules/post.module';
import { AppService } from '../services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature(Object.values(models)),
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        morgan(
          '\x1b[7m:date[iso]\x1b[0m :method :url :status :res[content-length] - :response-time ms',
        ),
      )
      .forRoutes('*');
    mongoose.set('debug', true);
  }
}
