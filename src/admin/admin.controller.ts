import { AzukiService } from '../azuki/azuki.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Req,
  Res,
  Query,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { AdminService } from './admin.service';
import { SongService } from '../song/song.service';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongDto } from '../Dtos/SongDto';
import { BeanService } from '../bean/bean.service';

@Controller('admin')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly azukiService: AzukiService,
    private readonly beanService: BeanService,
    private adminService: AdminService,
    private songService: SongService,
    private userService: UsersService
  ) {}

  // Azuki
  @Roles('admin', 'mod')
  @Post('/azuki')
  @UseInterceptors(FileInterceptor('image'))
  async addAzuki(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // <= 1mb
          new FileTypeValidator({ fileType: 'image' }),
        ],
      })
    )
    image: Express.Multer.File,
    @Body()
    data: {
      name: string;
      attributes: string;
    }
  ) {
    return this.azukiService.create(image, data);
  }

  //beanz
  @Roles('admin', 'mod')
  @Post('/beanz')
  @UseInterceptors(FileInterceptor('image'))
  async addBeanz(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // <= 1mb
          new FileTypeValidator({ fileType: 'image' }),
        ],
      })
    )
    image: Express.Multer.File,
    @Body()
    data: {
      name: string;
      attributes: string;
    }
  ) {
    return this.beanService.create(image, data);
  }

  @Roles('admin', 'mod')
  @Get('/trash')
  getTrash() {
    return 'Hello World!';
  }

  @Roles('admin', 'mod')
  @Get('/count')
  getCount() {
    return this.adminService.getCount();
  }

  @Roles('admin', 'mod')
  @Get('/users')
  async getUsers(@Query() query) {
    const { page, limit } = query;
    return this.userService.findAll(page, limit);
  }

  //users
  @Roles('admin', 'mod')
  @Post('/users')
  async createUser(@Body() data) {
    const { username, password, role } = data;
    return this.userService.addUser(username, password, role);
  }

  // Songs
  @Roles('admin', 'mod')
  @Post('/songs')
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
    file: Express.Multer.File,
    @Body()
    data: SongDto
  ) {
    return this.songService.create(file, data);
  }

  @Roles('admin', 'mod')
  @Delete('/songs')
  async deleteSong(@Query() query) {
    return this.songService.delete(query.song_id);
  }
}
