import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mock implementation of AuthService
const mockAuthService = {
  register: jest.fn((name, email, password) => {
    return { id: 1, name, email };
  }),
  login: jest.fn(user => {
    return { accessToken: 'fake-jwt-token', user };
  }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      const result = await controller.register(name, email, password);
      expect(result).toEqual({ id: 1, name, email });
      expect(service.register).toHaveBeenCalledWith(name, email, password);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      const req = { user };

      const result = await controller.login(req);
      expect(result).toEqual({ accessToken: 'fake-jwt-token', user });
      expect(service.login).toHaveBeenCalledWith(user);
    });
  });
});
