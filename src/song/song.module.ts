import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SongSchema } from '@/schemas/Song.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Song',
        schema: SongSchema,
      },
    ]),
    CloudinaryModule,
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
