import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

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
    email: string;
    name: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserPostDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'hong1234@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '비밀번호' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '홍길동' })
  name: string;
}
