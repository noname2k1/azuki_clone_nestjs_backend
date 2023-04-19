// import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CreateBeanDto } from './../Dtos/bean/createBean.dto';
import { UpdateBeanDto } from './../Dtos/bean/updateBeanDto';
import { BeanService } from './bean.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';

@Controller('bean')
// @UseGuards(RolesGuard)
// @UseGuards(JwtAuthGuard)
export class BeanController {
  constructor(private readonly beanService: BeanService) {}

  @Get()
  // @Roles('user')
  getAllWithoutDeleted(@Request() req, @Query() query: any) {
    const { page, limit } = query;
    return this.beanService.getAllWithoutDeleted(page, limit);
  }

  @Post('/get-by-attributes')
  getItemsByAttributes(@Body() attributes: any, @Query() query: any) {
    const { page, limit } = query;
    return this.beanService.getItemsByAttributes(attributes, page, limit);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.beanService.getOne(id);
  }

  @Post()
  create(@Body() createDto: CreateBeanDto) {
    return this.beanService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateBeanDto) {
    return this.beanService.update(id, updateDto);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string, @Query('action') action: string) {
    return this.beanService.softDelete(id, action);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.beanService.delete(id);
  }
}
