import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model, Types, Document } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(), // Add save mock
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      jest.spyOn(userModel, 'create').mockResolvedValue(Promise.resolve({
        name,
        email,
        password
      } as any));
      const result = await service.register(name, email, password);

      expect(userModel.create).toHaveBeenCalledWith({
        name,
        email,
        password: expect.any(String),
      });
      expect(result).toEqual({
        access_token: 'fake-jwt-token',
      });
    });

    it('should throw a ConflictException if email already exists', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      jest.spyOn(userModel, 'create').mockImplementation(() => {
        throw { code: 11000 };
      });

      await expect(service.register(name, email, password)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if validation is successful', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        _id: new Types.ObjectId(),
        name: 'John Doe',
        email,
        password: hashedPassword,
      } as Partial<UserDocument> as UserDocument);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        _id: expect.any(Types.ObjectId),
        name: 'John Doe',
        email,
        password: hashedPassword,
      });
    });

    it('should return null if validation fails', async () => {
      const email = 'john@example.com';
      const password = 'wrongpassword';

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token for valid user', async () => {
      const user = {
        _id: new Types.ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = await service.login(user as UserDocument);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
        name: user.name,
      });
      expect(result).toEqual({
        access_token: 'fake-jwt-token',
      });
    });
  });
});
