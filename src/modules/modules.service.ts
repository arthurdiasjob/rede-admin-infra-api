import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module, ModuleDocument } from './schemas/module.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const createdModule = new this.moduleModel(createModuleDto);
    return createdModule.save();
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async findOne(id: string): Promise<Module | null> {
    return this.moduleModel.findById(id).exec();
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<Module | null> {
    return this.moduleModel
      .findByIdAndUpdate(id, updateModuleDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Module | null> {
    return this.moduleModel.findByIdAndDelete(id).exec();
  }

  async findByTitulo(titulo: string): Promise<ModuleDocument | null> {
    return this.moduleModel.findOne({ titulo }).exec();
  }
}
