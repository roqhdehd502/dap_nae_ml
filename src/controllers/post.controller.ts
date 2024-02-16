import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SORT } from '../enums/post.enum';
import JwtGuard from '../guards/jwt.guard';
import { PostWithPutPostDTO } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly authSerive: AuthService,
    private readonly postService: PostService,
  ) {}

  @Get()
  @ApiOperation({ summary: '게시글 목록', description: '게시글 목록 불러오기' })
  @ApiQuery({
    name: 'sort',
    description: '정렬 기준',
    enum: SORT,
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: '한 페이지 내 불러올 게시글 수',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: '불러올 페이지 넘버',
    type: Number,
    required: false,
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async getPostList(
    @Query('sort') sort: SORT = SORT.DESC,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return await this.postService.getPostList(sort, limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세', description: '게시글 상세 불러오기' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 404, description: '데이터를 찾을 수 없음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async getPost(@Param('id') id: string) {
    return await this.postService.getPost(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 생성', description: '게시글 생성하기' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access Token (Bearer)',
    required: true,
  })
  @ApiHeader({ name: 'Refresh', description: 'Refresh Token', required: true })
  @ApiBody({
    type: PostWithPutPostDTO,
    description: '게시글 생성에 필요한 데이터',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async postPost(
    @Req() request: Request,
    @Body() postPostDTO: PostWithPutPostDTO,
  ) {
    const accessToken = request.headers.authorization?.replace('Bearer ', '');
    const refreshToken = request.headers.refresh as string;

    const user = await this.authSerive.getUserAsToken(
      accessToken,
      refreshToken,
    );

    await this.postService.postPost(user, postPostDTO);

    return {
      status: 'ok',
    };
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 수정', description: '게시글 수정하기' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access Token (Bearer)',
    required: true,
  })
  @ApiHeader({ name: 'Refresh', description: 'Refresh Token', required: true })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiBody({
    type: PostWithPutPostDTO,
    description: '게시글 수정에 필요한 데이터',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async putPost(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() putPostDTO: PostWithPutPostDTO,
  ) {
    const accessToken = request.headers.authorization?.replace('Bearer ', '');
    const refreshToken = request.headers.refresh as string;

    const user = await this.authSerive.getUserAsToken(
      accessToken,
      refreshToken,
    );

    await this.postService.putPost(user, putPostDTO, id);

    return {
      status: 'ok',
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 삭제', description: '게시글 삭제하기' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access Token (Bearer)',
    required: true,
  })
  @ApiHeader({ name: 'Refresh', description: 'Refresh Token', required: true })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async deletePost(@Param('id') id: string, @Req() request: Request) {
    const accessToken = request.headers.authorization?.replace('Bearer ', '');
    const refreshToken = request.headers.refresh as string;

    const user = await this.authSerive.getUserAsToken(
      accessToken,
      refreshToken,
    );

    await this.postService.deletePost(user, id);

    return {
      status: 'ok',
    };
  }
}
