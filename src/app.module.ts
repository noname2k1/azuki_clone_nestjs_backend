import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AzukiModule } from './azuki/azuki.module';
import { BeanModule } from './bean/bean.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SongModule } from './song/song.module';
// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    AzukiModule,
    BeanModule,
    AuthModule,
    UsersModule,
    AdminModule,
    CloudinaryModule,
    SongModule,
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost', //default host
    //   port: 6379, //default port
    // }),
  ],
  providers: [],
})
export class AppModule {}
