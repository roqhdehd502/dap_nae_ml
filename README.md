# NestJS Starter V1

Nest.js 기반으로 제작된 API 템플릿 입니다.
Nest.js, Typescript, Swagger, MongoDB 등이 적용되어 있습니다.

## 구성

현재 템플릿에서는 다음과 같은 라이브러리가 적용되어 있습니다.

```json
"dependencies": {
  "@nestjs/common": "^10.0.0",
  "@nestjs/config": "^3.1.1",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.2.0",                      | jwt/nest.js JWT 라이브러리
  "@nestjs/mongoose": "^10.0.2",                 | mongoose/nest.js ORM 라이브러리
  "@nestjs/passport": "^10.0.3",                 | passport/nest.js 인증 라이브러리
  "@nestjs/platform-express": "^10.0.0",         | express.js/nest.js 플랫폼 라이브러리
  "@types/cookie-parser": "^1.4.6",
  "@types/passport-jwt": "^4.0.1",
  "@types/passport-local": "^1.0.38",
  "bcrypt": "^5.1.1",                            | 암호화 라이브러리
  "class-transformer": "^0.5.1",                 | 클래스 폼 라이브러리
  "class-validator": "^0.14.1",                  | 클래스 검증 라이브러리
  "cookie-parser": "^1.4.6",                     | 쿠키 파싱 라이브러리
  "joi": "^17.12.1",                             | 입력 검증 라이브러리
  "mongoose": "^8.1.1",                          | mongoose ORM 라이브러리
  "passport": "^0.7.0",                          | passport 인증 라이브러리
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "reflect-metadata": "^0.1.13",                 | meta data 라이브러리
  "rxjs": "^7.8.1"                               | Observable 객체 타입 처리 라이브러리
},
"devDependencies": {
  "@nestjs/cli": "^10.0.0",
  "@nestjs/schematics": "^10.0.0",
  "@nestjs/swagger": "^7.2.0",
  "@nestjs/testing": "^10.0.0",
  "@types/bcrypt": "^5.0.2",
  "@types/express": "^4.17.21",
  "@types/jest": "^29.5.2",
  "@types/node": "^20.3.1",
  "@types/supertest": "^6.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",  | eslint 타입스크립트 적용
  "@typescript-eslint/parser": "^6.0.0",
  "eslint": "^8.42.0",                           | eslint
  "eslint-config-prettier": "^9.0.0",
  "eslint-plugin-prettier": "^5.0.0",
  "jest": "^29.5.0",
  "prettier": "^3.0.0",                          | prettier
  "source-map-support": "^0.5.21",
  "supertest": "^6.3.3",
  "swagger-ui-express": "^5.0.0",
  "ts-jest": "^29.1.0",
  "ts-loader": "^9.4.3",
  "ts-node": "^10.9.1",
  "tsconfig-paths": "^4.2.0",                    | typescript config
  "typescript": "^5.1.3"                         | typescript
},
```

## 설치

2023년 09월 11일, [Node 16버전](https://nodejs.org/en/blog/announcements/nodejs16-eol)의 지원이 중단(End-of-Life) 되었습니다.  
따라서, 로컬에 기본적으로 18버전 이상의 node.js가 설치되어 있어야합니다.

패키지 설치하기

```bash
yarn
```

환경 변수를 설정합니다. 아래 커맨드로 .env.example을 복사하여 .env 파일을 복사하여 만들어 줍니다.

```bash
cp .env.example .env
```

.env를 개발 환경에 맞게 수정해줍니다.

### 개발 환경 앱 실행

```bash
yarn start:dev
```

## 구조

```
├── src                             | src 디렉토리
│   ├── controllers                 | 컨트롤러 디렉토리
│   ├── filters                     | 필터링 디렉토리
│   ├── guards                      | 인증 처리(guard) 디렉토리
│   ├── interfaces                  | 타입스크립트 인터페이스 디렉토리
│   ├── models                      | mongo DB 모델 및 DTO 디렉토리
│   ├── modules                     | nest.js 모듈 디렉토리
│   ├── services                    | nest.js 서비스 디렉토리
│   ├── specs                       | nest.js 테스트 설정 디렉토리
│   ├── strategys                   | nest.js 역할 전략(strategy) 로직 디렉토리
│   └── main.ts                     | nest.js 메인 실행 파일
├── test                            | nest.js 테스트 코드 디렉토리
├── .env.example                    | 환경변수 예제 파일
├── .eslintrc.js                    | eslint 설정 파일
├── .gitignore                      | git 커밋 무시 설정
├── .prettierrc                     | prettier 설정 파일
├── nest-cli.json                   | nest-cli 프로젝트 자동화 설정 파일
├── package.json                    | package.json
├── README.md
├── tsconfig.json                   | 타입스크립트 설정 파일
└── vercel.json                     | vercel 배포 설정 파일 (필요 없을시 삭제)
```

## 가이드

### module

해당 기능 로직에 해당되는 controller, service, model 계층 로직을 구현한 다음 module 파일에 다음과 같이 구현합니다.

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from '../controllers/user.controller';
import { User, UserSchema } from '../models/user.model';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

참조 되는 다른 module 파일이나, 전역적으로 관리되는 module 파일에 다음과 같이 구현한 module을 import 합니다.

```ts
// 참조 되는 다름 module 파일
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
```

```ts
// 전역적으로 관리되는 module 파일
import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import mongoose from 'mongoose';
import { AppController } from '../controllers/app.controller';
import * as models from '../models';
import { AuthModule } from '../modules/auth.module';
import { PostModule } from '../modules/post.module';
import { AppService } from '../services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature(Object.values(models)),
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure() {
    mongoose.set('debug', true);
  }
}
```

### swagger 적용

nest.js/swagger 모듈로 인해 별도의 어노테이션('@')만 달아주어도 빌드시 자동으로 문서화를 할 수 있습니다.
따라서, controller 파일에 다음과 같은 방법으로 swagger 문서를 자동화 해줍니다.

```ts
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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
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
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async getPostList() {
    return await this.postService.getPostList();
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세', description: '게시글 상세 불러오기' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '성공' })
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
```

기타 자세한 사용법은 [해당 문서](https://docs.nestjs.com/openapi/introduction)를 참고하세요.
