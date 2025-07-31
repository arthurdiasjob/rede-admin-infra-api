import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel
      .find()
      .populate('usuarioCadastro', 'nome email')
      .exec();
  }

  async findOne(id: string): Promise<News | null> {
    return this.newsModel
      .findById(id)
      .populate('usuarioCadastro', 'nome email')
      .exec();
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News | null> {
    return this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .populate('usuarioCadastro', 'nome email')
      .exec();
  }

  async remove(id: string): Promise<News | null> {
    return this.newsModel.findByIdAndDelete(id).exec();
  }

  async findByUsuario(usuarioId: string): Promise<News[]> {
    return this.newsModel
      .find({ usuarioCadastro: usuarioId })
      .populate('usuarioCadastro', 'nome email')
      .exec();
  }

  async findAtivas(): Promise<News[]> {
    return this.newsModel
      .find({ ativo: true })
      .populate('usuarioCadastro', 'nome email')
      .exec();
  }
}
