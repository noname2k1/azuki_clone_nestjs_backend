import { Test, TestingModule } from '@nestjs/testing';
import { AzukiService } from './azuki.service';

describe('AzukiService', () => {
  let service: AzukiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AzukiService],
    }).compile();

    service = module.get<AzukiService>(AzukiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
