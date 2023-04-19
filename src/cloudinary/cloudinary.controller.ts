import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}
  @Post('song')
  @UseInterceptors(FileInterceptor('file'))
  async UploadSong(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // <= 5mb
          new FileTypeValidator({ fileType: 'audio' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    return this.cloudinaryService.uploadSong(file);
  }
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async UploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // <= 1mb
          new FileTypeValidator({ fileType: 'image' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    return this.cloudinaryService.uploadImage(file);
  }
}
