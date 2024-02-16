import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserPostDTO } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Not found user', {
        cause: new Error(),
        description: '등록된 유저 정보를 찾을 수 없습니다',
      });
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('Not found user', {
        cause: new Error(),
        description: '등록된 유저 정보를 찾을 수 없습니다',
      });
    }

    return user;
  }

  async create(body: UserPostDTO) {
    const { email, name, password } = body;
    const existUser = await this.userModel.findOne({ email: email });
    if (existUser) {
      throw new ConflictException('Already user', {
        cause: new Error(),
        description: '사용자 이메일은 이미 존재합니다',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      email: email,
      name: name,
      password: hashedPassword,
    });

    return newUser.readOnlyData;
  }
}
