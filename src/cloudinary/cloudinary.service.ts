import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadSong(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'azuki-clone/songs',
          tags: ['songs'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      toStream(file.buffer).pipe(upload);
    });
  }
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'azuki-clone/images',
          tags: ['images'],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(public_id: string) {
    // console.log(public_id);
    return new Promise((resolve, reject) => {
      v2.uploader
        .destroy(public_id, {
          resource_type: 'video',
        })
        .then((result) => {
          resolve(result);
        })
        .catch((errror) => reject(errror));
    });
  }
}
