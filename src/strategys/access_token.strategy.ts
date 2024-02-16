import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from '../interfaces/token_payload.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: TokenPayload) {
    return this.userService.getById(payload.userId);
  }
}
