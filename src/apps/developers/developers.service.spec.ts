import { Test, TestingModule } from '@nestjs/testing';
import { DevelopersService } from './services/developers.service';
import Developers from './dataManager';

describe('DevelopersService', () => {
  let service: DevelopersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopersService],
    }).compile();

    service = module.get<DevelopersService>(DevelopersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
test('should return an array of developers', async () => {
  let service: DevelopersService;
  const developers = await service.findAll();
  expect(developers).toEqual([
    {
      id: expect.any(String),
      firstName: 'John',
      interview: null,
      lastName: 'Doe',
      clientName: 'Acme Inc.',
      companyName: 'Acme Inc.',
      email: '<EMAIL>',
      jobTitle: 'Software Engineer',
      workStatus: 'Active',
      rolestatus: 'Accepted',
      experience: 5,
      salary: 80000,
      startDate: '2022-01-01',
      projectName: 'Project X',
      avatar: 'https://example.com/avatar.png',
    },
    {
      id: expect.any(String),
      firstName: 'Jane',
      interview: null,
      lastName: 'Doe',
      clientName: 'Acme Inc.',
      companyName: 'Acme Inc.',
      email: '<EMAIL>',
      jobTitle: 'Software Engineer',
      workStatus: 'Active',
      rolestatus: 'InHouse',
      experience: 3,
      salary: 60000,
      startDate: '2021-01-01',
      projectName: 'Project Y',
      avatar: 'https://example.com/avatar.png',
    },
  ]);
});

// test('should return null if developer does not exist', async () => {
//    let service: DevelopersService;
//   jest.spyOn(Developers, 'getById').mockImplementation(() => null);
//   const developer = await service.findOne('123');
//   expect(developer).toBeNull();
// });

// test('should throw an error if developer could not be created', async () => {
//    let service: DevelopersService;
//   jest.spyOn(Developers, 'enrollDev').mockImplementation(() => {
//     throw new Error('Could not create developer');
//   });
//   await expect(service.create({} as any)).rejects.toThrow(
//     'Could not create developer',
//   );
// })
