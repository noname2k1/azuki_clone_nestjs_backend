import { Test, TestingModule } from '@nestjs/testing';
import { AzukiController } from './azuki.controller';

describe('AzukiController', () => {
  let controller: AzukiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AzukiController],
    }).compile();

    controller = module.get<AzukiController>(AzukiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
