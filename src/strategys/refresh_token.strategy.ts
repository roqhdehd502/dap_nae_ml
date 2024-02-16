import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from '../interfaces/token_payload.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];

    return {
      ...payload,
      refreshToken,
    };
  }
}
