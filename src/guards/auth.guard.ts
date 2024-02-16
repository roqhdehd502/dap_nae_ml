import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationGuard extends AuthGuard('local') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new BadRequestException('Bad request authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다.',
      });
    }
    return user;
  }
}
