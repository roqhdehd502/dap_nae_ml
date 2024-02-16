import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import TokenPayload from '../interfaces/token_payload.interface';
import { AuthLoginDTO } from '../models/user_verification.model';
import { UserVerification } from '../models/user_verification.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(UserVerification.name)
    private readonly userVerificationModel: Model<UserVerification>,
  ) {}

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this._verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new BadRequestException('Bad request authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다.',
      });
    }
  }

  async createAccessWithRefreshToken(authLoginDTO: AuthLoginDTO) {
    try {
      // 회원가입한 유저 검증
      const { email, password } = authLoginDTO;
      const user = await this.getAuthenticatedUser(email, password);

      // Access Token, Refresh Token 생성
      const accessTokenPayload: TokenPayload = {
        userId: user._id,
        email: email,
      };
      const refreshTokenPayload: TokenPayload = {
        userId: user._id,
        email: email,
        tokenType: 'refresh',
      };
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      });
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      });

      // Refresh Token DB 저장
      const updateUserVerication =
        await this.userVerificationModel.findOneAndUpdate(
          { user: user._id },
          { code: refreshToken, status: 'ok', updatedAt: Date.now() },
          { new: true },
        );
      if (!updateUserVerication) {
        await this.userVerificationModel.create({
          user: user._id,
          code: refreshToken,
          status: 'ok',
        });
      }

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Bad request authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다',
      });
    }
  }

  async updateAccessWithRefreshToken(refreshToken: string) {
    try {
      const decodedRefreshToken = await this.jwtService.verify<TokenPayload>(
        refreshToken,
        { secret: process.env.JWT_SECRET },
      );
      if (!decodedRefreshToken) {
        throw new UnauthorizedException('Unauthorized authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      const getUserVerification = this.userVerificationModel.findOne({
        user: decodedRefreshToken.userId,
        code: refreshToken,
        status: 'ok',
      });
      if (!getUserVerification) {
        throw new BadRequestException('Bad request authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      const user = await this.userService.getById(decodedRefreshToken.userId);
      if (!user) {
        throw new BadRequestException('Bad request authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      // 재발급 할 Access Token, Refresh Token 생성
      const accessTokenPayload: TokenPayload = {
        userId: user._id,
        email: user.email,
      };
      const refreshTokenPayload: TokenPayload = {
        userId: user._id,
        email: user.email,
        tokenType: 'refresh',
      };
      const updatedAccessToken = this.jwtService.sign(accessTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      });
      const updatedRefreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      });

      // Refresh Token DB 업데이트
      const updateUserVerication =
        await this.userVerificationModel.findOneAndUpdate(
          { user: user._id },
          { code: updatedRefreshToken, status: 'ok', updatedAt: Date.now() },
          { new: true },
        );
      if (!updateUserVerication) {
        throw new BadRequestException('Bad request authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      return {
        updatedAccessToken: updatedAccessToken,
        updatedRefreshToken: updatedRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Unauthorized authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다',
      });
    }
  }

  async getUserAsToken(accessToken: string, refreshToken: string) {
    try {
      const decodedAccessToken = this.jwtService.verify<TokenPayload>(
        accessToken,
        { secret: process.env.JWT_SECRET },
      );
      if (!decodedAccessToken) {
        throw new UnauthorizedException('Unauthorized authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      const getUserVerification = this.userVerificationModel.findOne({
        user: decodedAccessToken.userId,
        code: refreshToken,
        status: 'ok',
      });
      if (!getUserVerification) {
        throw new BadRequestException('Bad request authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      const decodedRefreshToken = this.jwtService.verify<TokenPayload>(
        refreshToken,
        { secret: process.env.JWT_SECRET },
      );
      if (!decodedRefreshToken) {
        throw new UnauthorizedException('Unauthorized authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      const user = await this.userService.getById(decodedAccessToken.userId);
      if (!user) {
        throw new BadRequestException('Bad request authentication', {
          cause: new Error(),
          description: '잘못된 인증 정보입니다',
        });
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Bad request authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다',
      });
    }
  }

  private async _verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Bad request password', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다.',
      });
    }
  }
}
