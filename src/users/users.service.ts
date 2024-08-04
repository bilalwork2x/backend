import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findOne(email: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({  email: email }).exec();
  }
}