import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { SORT } from '../enums/post.enum';

@Schema()
export class Post extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Prop({
    default: Date.now,
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Prop()
  @IsDate()
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export class PostDTO {
  @ApiProperty()
  author: User;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export class PostWithPutPostDTO {
  @ApiProperty({ example: '제목' })
  title: string;

  @ApiProperty({ example: '내용' })
  content: string;
}
