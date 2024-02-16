import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, startSession } from 'mongoose';
import { Regression, PostRegressionDTO } from '../models/regression.model';

@Injectable()
export class RegressionService {
  constructor(
    @InjectModel(Regression.name)
    private readonly regressionModel: Model<Regression>,
  ) {}

  async getRegressionAsLinear(learningRate: number, maxIterations: number) {
    try {
      let params: number[] = [0, 0];

      for (let iteration = 0; iteration < maxIterations; iteration++) {
        const gradient = await this._calculateGradientLinear(params);
        params = params.map((param, i) => param - learningRate * gradient[i]);
      }

      return params;
    } catch (error) {
      throw new BadRequestException('Bad request regression', {
        cause: new Error(),
        description: '회귀 직선 결과를 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  async getRegressionAsNonlinear(learningRate: number, maxIterations: number) {
    try {
      let params: number[] = [0, 0];

      for (let iteration = 0; iteration < maxIterations; iteration++) {
        const gradient = await this._calculateGradient(params);
        params = params.map((param, i) => param - learningRate * gradient[i]);
      }

      return params;
    } catch (error) {
      throw new BadRequestException('Bad request regression', {
        cause: new Error(),
        description: '회귀 곡선 결과를 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  async postRegression(apiKey: string, postRegressionDTO: PostRegressionDTO) {
    try {
      if (apiKey !== process.env.API_KEY) {
        throw new BadRequestException('Bad request regression', {
          cause: new Error(),
          description: 'API 키가 올바르지 않습니다',
        });
      }

      const { volume } = postRegressionDTO;
      for (let i = 0; i < volume; i++) {
        const x = i;
        const y = Math.sin(i * 0.1) > 0 ? 1 : 0;
        const newRegression = await this.regressionModel.create({
          x: x,
          y: y,
        });
        newRegression.save();
      }
    } catch (error) {
      throw new BadRequestException('Bad request regression', {
        cause: new Error(),
        description:
          '회귀 곡선 샘플 데이터를 생성하는 도중 에러가 발생했습니다',
      });
    }
  }

  // 선형 함수
  private _linearFunction(x: number, params: number[]): number {
    const [m, b] = params;
    return m * x + b;
  }

  // 로지스틱 함수
  private _logisticFunction(x: number, params: number[]): number {
    const [a, b] = params;

    return 1 / (1 + Math.exp(-(a * x + b)));
  }

  // 손실 함수 (선형 회귀)
  private async _lossFunctionLinear(params: number[]): Promise<number> {
    try {
      const data = await this.regressionModel.find({});
      const parsedData = data.map((item) => {
        return {
          x: item.x,
          y: item.y,
        };
      });

      return (
        parsedData.reduce((sum, point) => {
          const predicted = this._linearFunction(point.x, params);
          return sum + Math.pow(predicted - point.y, 2);
        }, 0) /
        (2 * parsedData.length)
      );
    } catch (error) {
      throw new BadRequestException('Bad request regression', {
        cause: new Error(),
        description: '회귀 곡선 결과를 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  // 손실 함수 (비선형 회귀)
  private async _lossFunction(params: number[]): Promise<number> {
    try {
      const data = await this.regressionModel.find({});
      const parsedData = data.map((item) => {
        return {
          x: item.x,
          y: item.y,
        };
      });

      return (
        parsedData.reduce((sum, point) => {
          const predicted = this._logisticFunction(point.x, params);
          return sum + Math.pow(predicted - point.y, 2);
        }, 0) /
        (2 * parsedData.length)
      );
    } catch (error) {
      throw new BadRequestException('Bad request regression', {
        cause: new Error(),
        description: '회귀 곡선 결과를 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  // 손실 함수의 편도함수 계산 (선형 회귀)
  private async _calculateGradientLinear(params: number[]): Promise<number[]> {
    const epsilon = 1e-6;

    return Promise.all(
      params.map(async (param, i) => {
        const paramsPlusEpsilon = [...params];
        paramsPlusEpsilon[i] += epsilon;

        const paramsMinusEpsilon = [...params];
        paramsMinusEpsilon[i] -= epsilon;

        const lossPlusEpsilon =
          await this._lossFunctionLinear(paramsPlusEpsilon);
        const lossMinusEpsilon =
          await this._lossFunctionLinear(paramsMinusEpsilon);

        return (lossPlusEpsilon - lossMinusEpsilon) / (2 * epsilon);
      }),
    );
  }

  // 손실 함수의 편도함수 계산 (비선형 회귀)
  private async _calculateGradient(params: number[]): Promise<number[]> {
    const epsilon = 1e-6;

    return Promise.all(
      params.map(async (param, i) => {
        const paramsPlusEpsilon = [...params];
        paramsPlusEpsilon[i] += epsilon;

        const paramsMinusEpsilon = [...params];
        paramsMinusEpsilon[i] -= epsilon;

        const lossPlusEpsilon = await this._lossFunction(paramsPlusEpsilon);
        const lossMinusEpsilon = await this._lossFunction(paramsMinusEpsilon);

        return (lossPlusEpsilon - lossMinusEpsilon) / (2 * epsilon);
      }),
    );
  }
}
