import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SORT } from '../enums/post.enum';
import { User } from '../models/user.model';
import { Post, PostWithPutPostDTO } from '../models/post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async getPostList(sort: SORT, limit: number, page: number) {
    try {
      const postList = this.postModel
        .find()
        .sort({ createdAt: sort === SORT.ASC ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const parsedPostList = (await postList).map((post) => {
        return {
          _id: post._id,
          author: post.author,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt ?? '',
        };
      });
      return parsedPostList;
    } catch (error) {
      throw new BadRequestException('Bad request post', {
        cause: new Error(),
        description: '게시글 목록을 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  async getPost(postId: string) {
    try {
      const post = await this.postModel.findById({ _id: postId });
      if (!post) {
        throw new NotFoundException('Not found post', {
          cause: new Error(),
          description: '게시글 정보를 찾을 수 없습니다',
        });
      }
      return {
        _id: post._id,
        author: post.author,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt ?? '',
      };
    } catch (error) {
      throw new BadRequestException('Bad request post', {
        cause: new Error(),
        description: '게시글을 불러오는 도중 에러가 발생했습니다',
      });
    }
  }

  async postPost(user: User, body: PostWithPutPostDTO) {
    try {
      const { title, content } = body;
      await this.postModel.create({
        author: user._id,
        title: title,
        content: content,
      });
    } catch (error) {
      throw new BadRequestException('Bad request new post', {
        cause: new Error(),
        description: '게시글을 작성하는 도중 에러가 발생했습니다',
      });
    }
  }

  async putPost(user: User, body: PostWithPutPostDTO, id: string) {
    try {
      const author = await this.postModel.findOne({
        _id: id,
        author: user._id,
      });
      if (!author) {
        throw new NotFoundException('Not found post', {
          cause: new Error(),
          description: '수정할 게시글 정보를 찾을 수 없습니다',
        });
      }

      const { title, content } = body;
      const updatePost = await this.postModel.findByIdAndUpdate(
        id,
        { title: title, content: content, updatedAt: Date.now() },
        { new: true },
      );
      if (!updatePost) {
        throw new NotFoundException('Not found post', {
          cause: new Error(),
          description: '수정할 게시글 정보를 찾을 수 없습니다',
        });
      }
    } catch (error) {
      throw new BadRequestException('Bad request update post', {
        cause: new Error(),
        description: '게시글을 수정하는 도중 에러가 발생했습니다',
      });
    }
  }

  async deletePost(user: User, id: string) {
    try {
      const author = await this.postModel.findOne({
        _id: id,
        author: user._id,
      });
      if (!author) {
        throw new NotFoundException('Not found post', {
          cause: new Error(),
          description: '삭제할 게시글 정보를 찾을 수 없습니다',
        });
      }

      const deletePost = await this.postModel.findByIdAndDelete(id);
      if (!deletePost) {
        throw new NotFoundException('Not found post', {
          cause: new Error(),
          description: '삭제할 게시글 정보를 찾을 수 없습니다',
        });
      }
    } catch (error) {
      throw new BadRequestException('Bad request delete post', {
        cause: new Error(),
        description: '게시글을 삭제하는 도중 에러가 발생했습니다',
      });
    }
  }
}
