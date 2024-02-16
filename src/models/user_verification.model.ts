import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

@Schema()
export class UserVerification extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Prop({
    default: Date.now,
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Prop()
  @IsDate()
  updatedAt?: Date;

  readonly readOnlyData: {
    _id: string;
    user: string;
    code: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
  };
}

export const UserVerificationSchema =
  SchemaFactory.createForClass(UserVerification);

export class AuthLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'hong1234@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '비밀번호' })
  password: string;
}
