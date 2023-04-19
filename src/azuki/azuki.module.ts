import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AzukiService } from './azuki.service';
import { AzukiController } from './azuki.controller';
import { AzukiSchema } from '@/schemas/Azuki.schema';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Azuki',
        schema: AzukiSchema,
      },
    ]),
    CloudinaryModule,
  ],
  providers: [AzukiService],
  controllers: [AzukiController],
  exports: [AzukiService],
})
export class AzukiModule {}
