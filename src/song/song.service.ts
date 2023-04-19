import { SongDto } from '@/Dtos/SongDto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { HandleError } from '@/common/HandleError';
import { SongDocument } from '@/schemas/Song.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SongService {
  constructor(
    @InjectModel('Song') private songModel: Model<SongDocument>,
    private cloudinaryService: CloudinaryService
  ) {}

  async findAll(page = 1, limit = 30) {
    if (page == 0) {
      const songs = await this.songModel.find({
        deleted: false,
      });

      const count = await this.songModel.countDocuments();
      if (!songs) {
        return new HandleError();
      }
      return {
        message: 'Songs found successfully',
        songs,
        success: true,
        count,
      };
    }
    const songs = await this.songModel
      .find({
        deleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.songModel.countDocuments();
    if (!songs) {
      return new HandleError();
    }
    return {
      message: 'Songs found successfully',
      songs,
      success: true,
      count,
    };
  }

  async songsinTrash(page = 1, limit = 30) {
    const songs = await this.songModel
      .find({
        deleted: true,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.songModel.countDocuments({
      deleted: true,
    });
    if (!songs) {
      return new HandleError();
    }
    return {
      message: 'Songs in trash found successfully',
      songs,
      success: true,
      count,
    };
  }

  async create(file: Express.Multer.File, data: SongDto) {
    const songUpload = await this.cloudinaryService.uploadSong(file);

    const song = await this.songModel.create({
      ...data,
      src: songUpload.secure_url,
      public_id: songUpload.public_id,
    });

    if (!song) {
      return new HandleError();
    }
    return {
      message: 'Song created successfully',
      song,
      success: true,
    };
  }

  async update(id: string, data: SongDto) {
    const existedSong = await this.songModel.findById(id);
    if (!existedSong) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Song not found');
    }
    const song = await this.songModel.findOneAndUpdate(
      { _id: id },
      {
        ...data,
      },
      { new: true }
    );
    if (!song) {
      return new HandleError();
    }
    return {
      message: 'Song updated successfully',
      song,
      success: true,
    };
  }

  async softDelete(id: string, softDelete = true) {
    const existedSong = await this.songModel.findById(id);
    if (!existedSong) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Song not found');
    }
    const song = await this.songModel.findOneAndUpdate(
      { _id: id },
      {
        deleted: softDelete,
      },
      { new: true }
    );
    if (!song) {
      return new HandleError();
    }
    if (softDelete) {
      return {
        message: 'moved to trash',
        success: true,
      };
    } else {
      return {
        message: 'restored successfully',
        success: true,
      };
    }
  }

  async delete(id: string) {
    const song = await this.songModel.findById(id);
    if (!song) {
      return new HandleError(HttpStatus.BAD_REQUEST, 'Song not found');
    }
    const res: any = await this.cloudinaryService.deleteFile(song.public_id);
    if (res.result !== 'ok') {
      return new HandleError();
    }
    const delSong = await this.songModel.findByIdAndDelete(id);
    if (!delSong) {
      return new HandleError();
    }

    return {
      message: 'Song deleted successfully',
      success: true,
    };
  }
}
