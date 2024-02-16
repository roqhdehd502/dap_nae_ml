import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import RequestWithApiKey from '../interfaces/api_key.interface';
import { PostRegressionDTO } from '../models/regression.model';
import { RegressionService } from '../services/regression.service';

@ApiTags('regression')
@Controller('regression')
export class RegressionController {
  constructor(private readonly regressionSerive: RegressionService) {}

  @Get('linear')
  @ApiOperation({
    summary: '선형 회귀 파라미터 불러오기',
    description:
      '선형 모델의 최적 파라미터 불러오기\n* f(x) = mx + b\n* m: 첫번째 인덱스, b: 두번째 인덱스',
  })
  @ApiQuery({
    name: 'learningRate',
    description: '학습률',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'maxIterations',
    description: '학습횟수',
    type: Number,
    required: true,
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async getRegressionAsLinear(
    @Query('learningRate') learningRate: number,
    @Query('maxIterations') maxIterations: number,
  ) {
    return await this.regressionSerive.getRegressionAsLinear(
      learningRate,
      maxIterations,
    );
  }

  @Get('nonlinear')
  @ApiOperation({
    summary: '비선형 회귀 파라미터 불러오기',
    description:
      '로지스틱 회귀 모델의 최적 파라미터 불러오기\n* f(x) = 1 / (1 + e^-(m * x + b))\n* m: 첫번째 인덱스, b: 두번째 인덱스',
  })
  @ApiQuery({
    name: 'learningRate',
    description: '학습률',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'maxIterations',
    description: '학습횟수',
    type: Number,
    required: true,
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async getRegressionAsNonlinear(
    @Query('learningRate') learningRate: number,
    @Query('maxIterations') maxIterations: number,
  ) {
    return await this.regressionSerive.getRegressionAsNonlinear(
      learningRate,
      maxIterations,
    );
  }

  @Post()
  @ApiOperation({ summary: '게시글 생성', description: '게시글 생성하기' })
  @ApiHeader({
    name: 'apiKey',
    description: '지급 받은 API Key 입력',
    required: true,
  })
  @ApiBody({
    type: PostRegressionDTO,
    description: '회귀 분석용 샘플 데이터 생성에 필요한 데이터',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '요청상태가 올바르지 않음' })
  @ApiResponse({ status: 500, description: '내부 에러' })
  async postRegression(
    @Req() request: RequestWithApiKey,
    @Body() postRegressionDTO: PostRegressionDTO,
  ) {
    const apiKey = request.headers['apikey'] as string;

    await this.regressionSerive.postRegression(apiKey, postRegressionDTO);

    return {
      status: 'ok',
    };
  }
}
