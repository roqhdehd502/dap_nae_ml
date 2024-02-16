import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { PostController } from '../controllers/post.controller';
import { Post, PostSchema } from '../models/post.model';
import {
  UserVerification,
  UserVerificationSchema,
} from '../models/user_verification.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: UserVerification.name, schema: UserVerificationSchema },
    ]),
    JwtModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [AuthService, PostService],
  exports: [PostService],
})
export class PostModule {}
