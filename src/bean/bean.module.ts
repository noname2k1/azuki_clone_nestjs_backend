import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BeanService } from './bean.service';
import { BeanController } from './bean.controller';
import { BeanSchema } from '@/schemas/Bean.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Bean',
        schema: BeanSchema,
      },
    ]),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: '30s',
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [BeanService],
  controllers: [BeanController],
  exports: [BeanService],
})
export class BeanModule {}
