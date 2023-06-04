import HandleError from '@/common/HandleError';
import { AzukiDocument } from '@/schemas/Azuki.schema';
import { BeanDocument } from '@/schemas/Bean.schema';
import { SongDocument } from '@/schemas/Song.schema';
import { UserDocument } from '@/schemas/User.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Bean') private readonly beanModel: Model<BeanDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Azuki') private readonly azukiModel: Model<AzukiDocument>,
    @InjectModel('Song') private readonly songModel: Model<SongDocument>
  ) {}
  async getCount() {
    const azukiCount = await this.azukiModel.countDocuments();
    const beanCount = await this.beanModel.countDocuments();
    const userCount = await this.userModel.countDocuments();
    const songCount = await this.songModel.countDocuments();

    return {
      success: true,
      message: 'get count success',
      data: {
        azuki: azukiCount,
        beanz: beanCount,
        user: userCount,
        song: songCount,
      },
    };
  }
}
