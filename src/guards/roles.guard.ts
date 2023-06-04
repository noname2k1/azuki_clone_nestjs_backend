import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/User.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<UserDocument>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {
      const token: string = request.headers.authorization.split('Bearer ')[1];
      const decodedData = this.jwtService.decode(token, { json: true });
      if (decodedData && typeof decodedData === 'object') {
        const username = decodedData.username;
        const exitsUser = await this.userModel.findOne({
          username,
        });
        // console.log(exitsUser);
        if (!exitsUser) {
          return false;
        }
        const roleOfUser = exitsUser.role;
        return roles.includes(roleOfUser);
      }
    }
    return false;
  }
}
