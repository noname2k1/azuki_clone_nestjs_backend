import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongService } from './song.service';
import { SongDto } from '@/Dtos/SongDto';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  async findAll(@Query() query) {
    const { page, limit } = query;
    return this.songService.findAll(page, limit);
  }
}
