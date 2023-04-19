import { CreateBeanDto } from './../Dtos/bean/createBean.dto';
import { UpdateBeanDto } from './../Dtos/bean/updateBeanDto';
import { resultDto } from '@/common/resultDto';
import { BeanDocument } from '@/schemas/Bean.schema';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HandleError } from '@/common/HandleError';

@Injectable()
export class BeanService {
  constructor(
    @InjectModel('Bean') private readonly beanModel: Model<BeanDocument>
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
    const items = await this.beanModel
      .find({
        deleted: false,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.beanModel.countDocuments({
      deleted: false,
    });

    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty beans',
        count,
      };
    }

    return {
      success: true,
      message: 'get all beans success',
      data: items,
      count,
    };
  }

  //ADMIN
  async getAllWithDeleted(
    page = 1,
    limit = 30
  ): Promise<resultDto | HandleError> {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const items = await this.beanModel
      .find({
        deleted: true,
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.beanModel.countDocuments({
      deleted: true,
    });

    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty beans',
        count,
      };
    }

    return {
      success: true,
      message: 'get all beans with deleted success',
      data: items,
      count,
    };
  }

  //admin
  async getAll(page = 1, limit = 30): Promise<resultDto | HandleError> {
    if (limit > 30) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        'limit must be less than or equal to 30'
      );
    }
    const items = await this.beanModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.beanModel.countDocuments();

    if (items === undefined || count === undefined) {
      return new HandleError();
    }

    if ((items && items.length === 0) || !count) {
      return {
        success: true,
        message: 'empty beans',
        count,
      };
    }

    return {
      success: true,
      message: 'get all beans success',
      data: items,
      count,
    };
  }

  async getOne(id: string) {
    const idString = `Bean #${id}`;
    const existItem = await this.beanModel.findOne({
      name: {
        $regex: new RegExp(`^${idString}$`, 'i'),
      },
    });
    if (!existItem || existItem.name.split(idString)[1]) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean #${id} doesn't exist`
      );
    }
    return {
      success: true,
      message: `get bean #${id} success`,
      data: existItem,
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
        if (value) {
          return [
            (attr = `attributes.${attr}`),
            {
              $in: String(value)
                .split(',')
                .map((item) => item.trim()),
            },
          ];
        }
      })
    );
    // console.log(conditions);
    const beanz = await this.beanModel
      .find(conditions)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.beanModel.countDocuments(conditions);
    if (!beanz) {
      return new HandleError();
    }
    return {
      success: true,
      message: `search beans by attributes.filters success`,
      data: beanz,
      count,
    };
  }

  async create(createDto: CreateBeanDto) {
    const idInName = createDto.name.trim().split('#')[1];
    if (createDto.name.trim().indexOf('#') === -1 || !idInName) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean name must contain #[number]`
      );
    }
    const name = `Bean #${idInName}`;
    const existItem = await this.beanModel.findOne({
      name: {
        $regex: new RegExp('^' + name + '$', 'i'),
      },
    });

    if (existItem) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean #${idInName} existed`
      );
    }
    const { image, attributes } = createDto;
    const newItem = await this.beanModel.create({
      name: 'Bean #' + idInName,
      image,
      attributes: JSON.parse(attributes),
    });
    if (newItem) return new HandleError();
    return {
      success: true,
      message: `create bean ${idInName} success`,
      data: newItem,
    };
  }

  async update(id: string, updateDto: UpdateBeanDto) {
    const fullNameAzuki = `Bean #${id}`;
    const existItem = await this.beanModel.findOne({
      name: {
        $regex: new RegExp(`^${fullNameAzuki}$`, 'i'),
      },
    });
    if (!existItem) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean #${id} doesn't exist`
      );
    }
    const { image, attributes } = updateDto;
    const updatedItem = await this.beanModel.findOneAndUpdate(
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
    if (!updatedItem) return new HandleError();
    return {
      success: true,
      message: `update bean #${id} success`,
      data: updatedItem,
    };
  }

  // [Restore: admin], Soft-del: [user, admin]
  async softDelete(id: string, action: string) {
    let deleted = true;
    if (action === 'delete') {
      deleted = true;
    } else if (action === 'restore') {
      deleted = false;
    }

    const existItem = await this.beanModel.findOne({
      name: {
        $regex: new RegExp(`^Bean #${id}$`, 'i'),
      },
      deleted: !deleted,
    });
    console.log(existItem);
    if (!existItem) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean #${id} doesn't exist`
      );
    }

    const deletedItem = await this.beanModel.findOneAndUpdate(
      {
        name: {
          $regex: new RegExp(`^Bean #${id}$`, 'i'),
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

    if (!deletedItem) {
      return new HandleError();
    }

    if (action === 'delete') {
      return {
        success: true,
        message: `delete bean #${id} success`,
      };
    } else if (action === 'restore') {
      return {
        success: true,
        message: `restore bean #${id} success`,
      };
    }
  }

  //admin
  async delete(id: string) {
    const existItem = await this.beanModel.findOne({
      name: {
        $regex: new RegExp(`^Bean #${id}$`, 'i'),
      },
    });
    if (!existItem) {
      return new HandleError(
        HttpStatus.BAD_REQUEST,
        `bean #${id} doesn't exist`
      );
    }
    const deletedItem = await this.beanModel.findOneAndDelete({
      name: {
        $regex: new RegExp(`^Bean #${id}$`, 'i'),
      },
    });
    if (!deletedItem) {
      return new HandleError();
    }
    return {
      success: true,
      message: `delete bean #${id} success`,
    };
  }
}
