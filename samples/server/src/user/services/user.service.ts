import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async create(createUser: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUser);
      return await createdUser.save();
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  async update(id: string, updateUser: UpdateUserDto): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUser, {
        new: true,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async delete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
