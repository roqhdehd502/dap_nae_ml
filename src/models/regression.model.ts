import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Regression extends Document {
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  x: number;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  y: number;
}

export const RegressionSchema = SchemaFactory.createForClass(Regression);

export class PostRegressionDTO {
  @IsInt()
  @ApiProperty({
    description: '샘플 데이터 크기 (Length)',
    type: Number,
    required: true,
    example: 10,
  })
  volume: number;
}
