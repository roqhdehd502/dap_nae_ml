import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthenticationGuard } from '../guards/auth.guard';
import JwtGuard from '../guards/jwt.guard';
import { AuthLoginDTO } from '../models/user_verification.model';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSerive: AuthService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '인증 및 유저정보 가져오기',
    description: 'JWT 인증 토큰 검증 후 로그인 된 유저정보 가져오기',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access Token (Bearer)',
    required: true,
  })
  @ApiHeader({ name: 'Refresh', description: 'Refresh Token', required: true })
  async authenticate(@Req() request: Request) {
    try {
      const accessToken = request.headers.authorization?.replace('Bearer ', '');
      const refreshToken = request.headers.refresh as string;

      const { _id, email, name, createdAt, updatedAt } =
        await this.authSerive.getUserAsToken(accessToken, refreshToken);

      return {
        _id: _id,
        email: email,
        name: name,
        createdAt: createdAt,
        updatedAt: updatedAt ?? '',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad request authentication', {
        cause: new Error(),
        description: '잘못된 인증 정보입니다.',
      });
    }
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인 후 JWT 발급',
  })
  @ApiBody({
    type: AuthLoginDTO,
    description: '유저 로그인에 필요한 데이터',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 401, description: '인증 에러' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async logIn(@Body() authLoginDTO: AuthLoginDTO, @Res() response: Response) {
    const { accessToken, refreshToken } =
      await this.authSerive.createAccessWithRefreshToken(authLoginDTO);

    response.setHeader('Authorization', 'Bearer ' + accessToken);
    response.setHeader('Refresh', refreshToken);

    return response.send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  @Put('refresh')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'JWT 토큰 재발급',
    description: '로그인 된 유저 JWT 토큰 재발급 (유효한 Refresh Token 필요)',
  })
  @ApiHeader({ name: 'Refresh', description: 'Refresh Token', required: true })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 401, description: '인증 에러' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.headers.refresh as string;

    const { updatedAccessToken, updatedRefreshToken } =
      await this.authSerive.updateAccessWithRefreshToken(refreshToken);

    response.setHeader('Authorization', 'Bearer ' + updatedAccessToken);
    response.setHeader('Refresh', updatedRefreshToken);

    return response.send({
      accessToken: updatedAccessToken,
      refreshToken: updatedRefreshToken,
    });
  }
}
