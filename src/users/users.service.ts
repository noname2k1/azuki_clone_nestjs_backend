import HandleError from '../common/HandleError';
import { UserDocument } from './../schemas/User.schema';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bcrypt } from '../utils/Bcrypt';
import { UserDto } from '@/Dtos/UserDto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  async findAll(page = 1, limit = 30) {
    const users = await this.userModel
      .find({
        deleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');
    const count = await this.userModel.countDocuments();
    if (!users) {
      return new HandleError();
    }
    return {
      message: 'Users found successfully',
      users,
      success: true,
      count,
    };
  }

  async getUser(username: string, password: string): Promise<any> {
    const existUser = await this.userModel.findOne({
      username: username,
    });
    if (!existUser) {
      return false;
    }
    const isMatch = await Bcrypt.comparePassword(password, existUser.password);
    if (!isMatch) {
      return false;
    }
    return existUser;
  }

  async create(username: string, password: string): Promise<any> {
    const existUser = await this.userModel.findOne({
      username: username,
    });
    if (existUser) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'User already exists');
    }
    const hashPassword = await Bcrypt.hashPassword(password);
    if (!hashPassword) return new HandleError();
    const newUser = await this.userModel.create({
      username: username,
      password: hashPassword,
    });
    if (!newUser) return new HandleError();
    const { password: passwordOfUser, ...user } = newUser;
    return user;
  }

  async changePassword(username: string, newPassword: string) {
    const hashPassword = await Bcrypt.hashPassword(newPassword);
    if (!hashPassword) return new HandleError();
    const existUser = await this.userModel.findOne({
      username: username,
    });
    if (!existUser)
      return new HandleError(HttpStatus.NOT_FOUND, 'User not found');
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        username: username,
      },
      {
        password: hashPassword,
      },
      { new: true }
    );
    if (!updatedUser) return new HandleError();
    const { password, ...user } = updatedUser;
    return user;
  }

  // admin
  async addUser(username: string, password: string, role: string) {
    const existUser = await this.userModel.findOne({
      username: username,
    });
    if (existUser) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'User already exists');
    }
    if (['admin', 'mod', 'user'].indexOf(role) === -1) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Role is not valid');
    }
    const hashPassword = await Bcrypt.hashPassword(password);
    if (!hashPassword) return new HandleError();
    const newUser = await this.userModel.create({
      username: username,
      password: hashPassword,
      role: role,
    });
    if (!newUser) return new HandleError();
    const { password: passwordOfUser, ...user } = newUser;
    return {
      message: 'User created successfully',
      success: true,
    };
  }
}
