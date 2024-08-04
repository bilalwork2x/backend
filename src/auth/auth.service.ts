import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const savedUser = await this.userModel.create({ name, email, password: hashedPassword })
      const payload = { email: savedUser.email, sub: savedUser._id, name: savedUser.name };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user._id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
