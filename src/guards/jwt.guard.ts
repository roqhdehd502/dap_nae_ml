import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다',
      });
    }
    return user;
  }
}
