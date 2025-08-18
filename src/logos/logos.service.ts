import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { Logo, LogoDocument } from './schemas/logo.schema';

@Injectable()
export class LogosService {
  constructor(@InjectModel(Logo.name) private logoModel: Model<LogoDocument>) {}

  async create(createLogoDto: CreateLogoDto): Promise<Logo> {
    const createdLogo = new this.logoModel(createLogoDto);
    return createdLogo.save();
  }

  async findAll(): Promise<Logo[]> {
    return this.logoModel.find().exec();
  }

  async findOne(id: string): Promise<Logo | null> {
    return this.logoModel.findById(id).exec();
  }

  async update(id: string, updateLogoDto: UpdateLogoDto): Promise<Logo | null> {
    return this.logoModel
      .findByIdAndUpdate(id, updateLogoDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Logo | null> {
    return this.logoModel.findByIdAndDelete(id).exec();
  }

  async findByTitulo(titulo: string): Promise<LogoDocument | null> {
    return this.logoModel.findOne({ titulo }).exec();
  }
}
