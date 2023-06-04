import { Bean, BeanSchema } from './../schemas/Bean.schema';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AzukiModule } from '@/azuki/azuki.module';
import { BeanModule } from '@/bean/bean.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/User.schema';
import { UsersModule } from '@/users/users.module';
import { SongModule } from '@/song/song.module';
import { AzukiSchema } from '../schemas/Azuki.schema';
import { SongSchema } from '../schemas/Song.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Azuki',
        schema: AzukiSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Bean',
        schema: BeanSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Song',
        schema: SongSchema,
      },
    ]),
    BeanModule,
    UsersModule,
    SongModule,
    AzukiModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '30s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
