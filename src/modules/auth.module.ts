import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import {
  UserVerification,
  UserVerificationSchema,
} from '../models/user_verification.model';
import { UserModule } from '../modules/user.module';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategys/local.strategy';
import { AccessTokenStrategy } from '../strategys/access_token.strategy';
import { RefreshTokenStrategy } from '../strategys/refresh_token.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserVerification.name, schema: UserVerificationSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
