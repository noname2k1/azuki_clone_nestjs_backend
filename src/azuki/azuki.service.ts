import { UpdateAzukiDto } from './../Dtos/azuki/updateAzukiDto';
import { resultDto } from '@/common/resultDto';
import { AzukiDocument } from '@/schemas/Azuki.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import HandleError from '../common/HandleError';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AzukiService {
  constructor(
    @InjectModel('Azuki') private readonly azukiModel: Model<AzukiDocument>,
    private cloudinaryService: CloudinaryService
  ) {}

  async getAllWithoutDeleted(
    page = 1,
    limit = 15
  ): Promise<resultDto | HandleError> {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }

    const items = await this.azukiModel
      .find({
        deleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.azukiModel.countDocuments({
      deleted: false,
    });

    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty azukis',
        count,
      };
    }

    return {
      success: true,
      message: 'get all azukis success',
      data: items,
      count,
    };
  }

  //admin
  async getAllWithDeleted(
    page = 1,
    limit = 15
  ): Promise<resultDto | HandleError> {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const items = await this.azukiModel
      .find({
        deleted: true,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.azukiModel.countDocuments({
      deleted: true,
    });

    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty azukis',
        count,
      };
    }
    return {
      success: true,
      message: 'get all azukis with deleted success',
      data: items,
      count,
    };
  }

  //admin
  async getAll(page = 1, limit = 15): Promise<resultDto | HandleError> {
    const items = await this.azukiModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const count = await this.azukiModel.countDocuments();
    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty azukis',
        count,
      };
    }
    return {
      success: true,
      message: 'get all azukis success',
      data: items,
      count,
    };
  }

  async getOne(id: string) {
    const idString = `Azuki #${id}`;
    const azukiExist = await this.azukiModel.findOne({
      name: {
        $regex: new RegExp(`^${idString}$`, 'i'),
      },
    });
    if (!azukiExist || azukiExist.name.split(idString)[1]) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `Azuki #${id} doesn't exist`
      );
    }
    return {
      success: true,
      message: `get azuki #${id} success`,
      data: azukiExist,
    };
  }

  async getItemsByAttributes(attributes: any, page = 1, limit = 30) {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const conditions = Object.fromEntries(
      Object.entries(attributes).map((item) => {
        // eslint-disable-next-line prefer-const
        let [attr, value] = item;
        return [
          (attr = `attributes.${attr}`),
          {
            $in: String(value)
              .split(',')
              .map((item) => item.trim()),
          },
        ];
      })
    );
    // console.log(conditions);
    const azukis = await this.azukiModel
      .find(conditions)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.azukiModel.countDocuments(conditions);
    if (!azukis) {
      return new HandleError();
    }
    return {
      success: true,
      message: `search azukis by attributes.filters success`,
      data: azukis,
      count,
    };
  }

  async getGoldenAzukis(page = 1, limit = 30) {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const azukis = await this.azukiModel
      .find({
        $or: [
          { 'attributes.Offhand': new RegExp('Golden', 'i') },
          { 'attributes.Clothing': new RegExp('Golden', 'i') },
          { 'attributes.Hand': new RegExp('Golden', 'i') },
          { 'attributes.Headgear': new RegExp('Golden', 'i') },
          { 'attributes.Shoe': new RegExp('Golden', 'i') },
          { 'attributes.Neck': new RegExp('Golden', 'i') },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.azukiModel.countDocuments({
      $or: [
        { 'attributes.Offhand': new RegExp('Golden', 'i') },
        { 'attributes.Clothing': new RegExp('Golden', 'i') },
        { 'attributes.Hand': new RegExp('Golden', 'i') },
        { 'attributes.Headgear': new RegExp('Golden', 'i') },
        { 'attributes.Shoe': new RegExp('Golden', 'i') },
        { 'attributes.Neck': new RegExp('Golden', 'i') },
      ],
    });
    if (!azukis) {
      return new HandleError();
    }
    return {
      success: true,
      message: `get golden azukis success`,
      data: azukis,
      count,
    };
  }

  async getGoldenAzukisByAttributes(attributes: any, page = 1, limit = 30) {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const conditions = Object.fromEntries(
      Object.entries(attributes).map((item) => {
        // eslint-disable-next-line prefer-const
        let [attr, value] = item;
        return [
          (attr = `attributes.${attr}`),
          {
            $in: String(value)
              .split(',')
              .map((item) => item.trim()),
          },
        ];
      })
    );
    // console.log(conditions);
    const azukis = await this.azukiModel
      .find(conditions)
      .find({
        $or: [
          { 'attributes.Offhand': new RegExp('Golden', 'i') },
          { 'attributes.Clothing': new RegExp('Golden', 'i') },
          { 'attributes.Hand': new RegExp('Golden', 'i') },
          { 'attributes.Headgear': new RegExp('Golden', 'i') },
          { 'attributes.Shoe': new RegExp('Golden', 'i') },
          { 'attributes.Neck': new RegExp('Golden', 'i') },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.azukiModel
      .find(conditions)
      .find({
        $or: [
          { 'attributes.Offhand': new RegExp('Golden', 'i') },
          { 'attributes.Clothing': new RegExp('Golden', 'i') },
          { 'attributes.Hand': new RegExp('Golden', 'i') },
          { 'attributes.Headgear': new RegExp('Golden', 'i') },
          { 'attributes.Shoe': new RegExp('Golden', 'i') },
          { 'attributes.Neck': new RegExp('Golden', 'i') },
        ],
      })
      .count();
    if (!azukis) {
      return new HandleError();
    }
    return {
      success: true,
      message: `get golden azukis by attributes.filters success`,
      data: azukis,
      count,
    };
  }

  async create(
    image: Express.Multer.File,
    createDto: {
      name: string;
      attributes: string;
    }
  ) {
    const idInName = createDto.name.trim().split('#')[1];
    if (createDto.name.trim().indexOf('#') === -1 || !idInName) {
      return {
        success: false,
        message: `azuki name must contain #[number]`,
      };
    }
    const name = `Azuki #${idInName}`;
    const azukiExist = await this.azukiModel.findOne({
      name: {
        $regex: new RegExp('^' + name + '$', 'i'),
      },
    });

    if (azukiExist) {
      return new HandleError(HttpStatus.BAD_REQUEST, `${name} existed`);
    }
    const charUpload = await this.cloudinaryService.uploadImage(image);
    if (!charUpload) {
      return new HandleError();
    }
    const { attributes } = createDto;
    const newAzuki = await this.azukiModel.create({
      name: 'Azuki #' + idInName,
      image: charUpload.secure_url,
      attributes: JSON.parse(attributes),
      public_id: charUpload.public_id,
    });
    if (!newAzuki) return new HandleError();
    return {
      success: true,
      message: `create azuki ${idInName} success`,
      data: newAzuki,
    };
  }

  async update(id: string, updateDto: UpdateAzukiDto) {
    const fullNameAzuki = `Azuki #${id}`;
    const existAzuki = await this.azukiModel.findOne({
      name: {
        $regex: new RegExp(`^${fullNameAzuki}$`, 'i'),
      },
    });
    if (!existAzuki) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `Azuki #${id} doesn't exist`
      );
    }
    const { image, attributes } = updateDto;
    const updatedAzuki = await this.azukiModel.findOneAndUpdate(
      {
        name: {
          $regex: new RegExp(`^${fullNameAzuki}$`, 'i'),
        },
      },
      {
        image,
        attributes: JSON.parse(attributes),
      },
      {
        new: true,
      }
    );
    if (!updatedAzuki) return new HandleError();
    return {
      success: true,
      message: `update azuki #${id} success`,
      data: updatedAzuki,
    };
  }

  // [Restore: admin] [soft-del: user,admin]
  async softDelete(id: string, action: string) {
    let deleted = true;
    if (action === 'delete') {
      deleted = true;
    } else if (action === 'restore') {
      deleted = false;
    }

    const existedAzuki = await this.azukiModel.findOne({
      name: {
        $regex: new RegExp(`^Azuki #${id}$`, 'i'),
      },
      deleted: !deleted,
    });
    if (!existedAzuki) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `Azuki #${id} doesn't exist`
      );
    }

    const deletedAzuki = await this.azukiModel.findOneAndUpdate(
      {
        name: {
          $regex: new RegExp(`^Azuki #${id}$`, 'i'),
        },
        deleted: !deleted,
      },
      {
        deleted,
      },
      {
        new: true,
      }
    );

    if (!deletedAzuki) {
      return new HandleError();
    }

    if (action === 'delete') {
      return {
        success: true,
        message: `delete azuki #${id} success`,
      };
    } else if (action === 'restore') {
      return {
        success: true,
        message: `restore azuki #${id} success`,
      };
    }
  }

  //admin
  async delete(id: string) {
    const existAzuki = await this.azukiModel.findOne({
      name: {
        $regex: new RegExp(`^Azuki #${id}$`, 'i'),
      },
    });
    if (!existAzuki) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `Azuki #${id} doesn't exist`
      );
    }

    const deletedAzuki = await this.azukiModel.findOneAndDelete({
      name: {
        $regex: new RegExp(`^Azuki #${id}$`, 'i'),
      },
    });

    if (!deletedAzuki) {
      return new HandleError();
    }

    return {
      success: true,
      message: `delete azuki #${id} success`,
    };
  }
}
