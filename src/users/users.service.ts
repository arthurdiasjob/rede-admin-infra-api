import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserModule } from './schemas/user.schema';
import { AddModuleToUserDto, UpdateUserModuleDto } from './dto/user-module.dto';
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

  // Métodos para gerenciar módulos do usuário
  async addModuleToUser(
    userId: string,
    addModuleDto: AddModuleToUserDto,
    moduleTitle: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o módulo já existe para o usuário
    const existingModule = user.modulos?.find(
      (m) => m.moduleId === addModuleDto.moduleId,
    );
    if (existingModule) {
      // Se já existe, apenas reativar
      existingModule.ativo = true;
    } else {
      // Adicionar novo módulo
      const newModule: UserModule = {
        moduleId: addModuleDto.moduleId,
        titulo: moduleTitle,
        ativo: true,
      };
      user.modulos = user.modulos || [];
      user.modulos.push(newModule);
    }

    return await user.save();
  }

  async removeModuleFromUser(
    userId: string,
    moduleId: string,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.modulos = user.modulos?.filter((m) => m.moduleId !== moduleId) || [];
    return await user.save();
  }

  async updateUserModule(
    userId: string,
    moduleId: string,
    updateModuleDto: UpdateUserModuleDto,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const moduleIndex = user.modulos?.findIndex((m) => m.moduleId === moduleId);
    if (moduleIndex === -1 || moduleIndex === undefined) {
      throw new NotFoundException('Módulo não encontrado para este usuário');
    }

    if (user.modulos) {
      user.modulos[moduleIndex].ativo = updateModuleDto.ativo;
    }

    return await user.save();
  }

  async getUserModules(userId: string): Promise<UserModule[]> {
    const user = await this.userModel.findById(userId).select('modulos');
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user.modulos || [];
  }
}
