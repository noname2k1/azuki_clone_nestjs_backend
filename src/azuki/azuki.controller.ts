import { UpdateAzukiDto } from './../Dtos/azuki/updateAzukiDto';
import { CreateAzukiDto } from '@/Dtos/azuki/createAzuki.dto';
import { AzukiService } from '@/azuki/azuki.service';
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
} from '@nestjs/common';

@Controller('azuki')
export class AzukiController {
  constructor(private readonly azukiService: AzukiService) {}

  @Get()
  getAllWithoutDeleted(@Query() query: any) {
    const { page, limit } = query;
    return this.azukiService.getAllWithoutDeleted(page, limit);
  }

  @Post('/get-by-attributes')
  getItemsByAttributes(@Body() attributes: any, @Query() query: any) {
    const { page, limit } = query;
    return this.azukiService.getItemsByAttributes(attributes, page, limit);
  }

  @Get('/golden-mode')
  getGoldenAzukis(@Query() query: any) {
    const { page, limit } = query;
    return this.azukiService.getGoldenAzukis(page, limit);
  }

  @Post('/golden-mode/get-by-attributes')
  getGoldenAzukisByAttributes(@Body() attributes: any, @Query() query: any) {
    const { page, limit } = query;
    return this.azukiService.getGoldenAzukisByAttributes(
      attributes,
      page,
      limit
    );
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.azukiService.getOne(id);
  }

  // @Post()
  // create(@Body() createDto: CreateAzukiDto) {
  //   return this.azukiService.create(createDto);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAzukiDto) {
    return this.azukiService.update(id, updateDto);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string, @Query('action') action: string) {
    return this.azukiService.softDelete(id, action);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.azukiService.delete(id);
  }
}
