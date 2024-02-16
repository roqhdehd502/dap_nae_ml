/// <reference types="node" />

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { AppController } from '../controllers/app.controller';
import * as models from '../models';
import { RegressionModule } from './regression.module';
import { AppService } from '../services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature(Object.values(models)),
    RegressionModule,
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
