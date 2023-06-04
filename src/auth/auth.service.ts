import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '@/Dtos/UserDto';
import HandleError from '../common/HandleError';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/User.schema';
import { Bcrypt } from '@/utils/Bcrypt';
import { JwtService } from '@nestjs/jwt';
import DeviceDetector = require('node-device-detector');
import { Request, Response } from 'express';

const refreshTokens = {};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  private detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });

  private generateTokens(res: Response, payload, existUser): string {
    const access_token = this.jwtService.sign(payload, {
      expiresIn:
        existUser.role === 'admin'
          ? JSON.parse(process.env.ACCESS_TOKEN_EXPIRE_TIME)
          : '2 days',
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn:
        existUser.role === 'admin'
          ? JSON.parse(process.env.REFRESH_TOKEN_EXPIRE_TIME)
          : '30d',
    });

    res.cookie('refresh_token', refresh_token, {
      // httpOnly: true,
      maxAge:
        existUser.role === 'admin'
          ? 1000 *
              60 *
              (JSON.parse(process.env.REFRESH_TOKEN_EXPIRE_TIME) / 60) +
            20 * 1000
          : 1000 * 60 * 60 * 24 * 32,
    });

    refreshTokens[refresh_token] = refresh_token;

    return access_token;
  }

  async login(res: Response, req: any, originalPassword: string): Promise<any> {
    const { id, username, role } = req.user;
    const existUser = await this.userModel.findOne({
      username,
    });

    // const userAgent = req.headers['user-agent'];
    // const result = this.detector.detect(userAgent);
    // console.log('result parse', result);

    if (!existUser) {
      return new HandleError(HttpStatus.NOT_FOUND, 'User not found');
    }
    const isMatch = await Bcrypt.comparePassword(
      originalPassword,
      existUser.password
    );
    if (!isMatch) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Password incorrect');
    }
    // generator access-token for user
    const payload = {
      id,
      username,
      role,
    };
    const access_token = this.generateTokens(res, payload, existUser);
    const { password, ...restUser } = req.user;
    return {
      success: true,
      message: 'Login success',
      data: restUser,
      access_token,
    };
  }

  async register(user: UserDto, res: Response, req: Request): Promise<any> {
    const { username, password } = user;
    const existUser = await this.userModel.findOne({
      username: username,
    });
    // console.log(req.headers);

    if (existUser) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'User existed');
    }

    const hashPassword = await Bcrypt.hashPassword(password);
    if (!hashPassword) return new HandleError();
    const newUser = await this.usersService.create(username, password);
    if (!newUser) return new HandleError();
    const { password: pwdOfNewUser, ...restOfUser } = newUser._doc;
    const payload = {
      id: restOfUser._id,
      username: restOfUser.username,
      role: restOfUser.role,
    };
    // generator access-token for user
    const access_token = this.generateTokens(res, payload, restOfUser);
    return {
      success: true,
      message: 'register success',
      data: restOfUser,
      access_token,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const existedUser = await this.usersService.getUser(username, password);
    if (existedUser) {
      return existedUser._doc;
    }
    return null;
  }

  async refreshToken(res: Response, req: Request) {
    if (!refreshTokens[req.cookies['refresh_token']]) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Refresh token invalid');
    }
    const decodedData = this.jwtService.verify(req.cookies['refresh_token']);
    const existUser = await this.userModel.findOne({
      username: decodedData.username,
      role: decodedData.role,
    });
    if (!existUser) {
      return new HandleError(HttpStatus.NOT_FOUND, 'User not found');
    }
    const payload = {
      id: existUser._id,
      username: existUser.username,
      role: existUser.role,
    };
    const access_token = this.generateTokens(res, payload, existUser);
    if (access_token) {
      delete refreshTokens[req.cookies['refresh_token']];
      return {
        success: true,
        message: 'refresh token success',
        access_token,
      };
    }
  }
}
