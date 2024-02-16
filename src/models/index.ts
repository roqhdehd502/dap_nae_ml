import { ModelDefinition } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.model';
import { User, UserSchema } from './user.model';
import {
  UserVerification,
  UserVerificationSchema,
} from './user_verification.model';

export const PostModelDefinition: ModelDefinition = {
  name: Post.name,
  schema: PostSchema,
};
export const UserModelDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};
export const UserVerificationModelDefinition: ModelDefinition = {
  name: UserVerification.name,
  schema: UserVerificationSchema,
};
