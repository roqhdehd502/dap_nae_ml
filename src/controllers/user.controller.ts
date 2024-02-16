import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserPostDTO } from '../models/user.model';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 회원가입', description: '유저 회원가입하기' })
  @ApiBody({
    type: UserPostDTO,
    description: '유저 회원가입에 필요한 데이터',
  })
  @ApiResponse({ status: 201, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 401, description: '인증 에러' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async postUser(@Body() body: UserPostDTO) {
    return await this.userService.create(body);
  }
}
