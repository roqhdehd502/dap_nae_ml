import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegressionController } from '../controllers/regression.controller';
import { Regression, RegressionSchema } from '../models/regression.model';
import { RegressionService } from '../services/regression.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Regression.name, schema: RegressionSchema },
    ]),
  ],
  controllers: [RegressionController],
  providers: [RegressionService],
  exports: [RegressionService],
})
export class RegressionModule {}
