import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      senha: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-senha').exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-senha').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Se a senha está sendo atualizada, criptografá-la
    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(updateUserDto.senha, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-senha')
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
