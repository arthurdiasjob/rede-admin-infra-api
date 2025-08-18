import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CliqueResponseDto } from './dto/clique-response.dto';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova notícia' })
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notícias' })
  @ApiQuery({
    name: 'ativas',
    required: false,
    description: 'Filtrar por notícias ativas (true/false)',
  })
  @ApiQuery({
    name: 'usuario',
    required: false,
    description: 'Filtrar por ID do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notícias retornada com sucesso',
  })
  findAll(
    @Query('ativas') ativas?: string,
    @Query('usuario') usuario?: string,
  ) {
    if (ativas === 'true') {
      return this.newsService.findAtivas();
    }
    if (usuario) {
      return this.newsService.findByUsuario(usuario);
    }
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar notícia por ID' })
  @ApiParam({ name: 'id', description: 'ID da notícia' })
  @ApiResponse({ status: 200, description: 'Notícia encontrada' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOne(id);
    if (!news) {
      throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
    }
    return news;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar notícia' })
  @ApiParam({ name: 'id', description: 'ID da notícia' })
  @ApiBody({ type: UpdateNewsDto })
  @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    const news = await this.newsService.update(id, updateNewsDto);
    if (!news) {
      throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
    }
    return news;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir notícia' })
  @ApiParam({ name: 'id', description: 'ID da notícia' })
  @ApiResponse({ status: 200, description: 'Notícia removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async remove(@Param('id') id: string) {
    const news = await this.newsService.remove(id);
    if (!news) {
      throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
    }
    return { message: 'Notícia removida com sucesso' };
  }

  @Patch(':id/clique')
  @ApiOperation({ summary: 'Incrementar contador de cliques da notícia' })
  @ApiParam({ name: 'id', description: 'ID da notícia' })
  @ApiResponse({
    status: 200,
    description: 'Clique contabilizado com sucesso',
    type: CliqueResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  async incrementarClique(@Param('id') id: string) {
    try {
      const news = await this.newsService.incrementarCliques(id);
      if (!news) {
        throw new HttpException('Notícia não encontrada', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Clique contabilizado com sucesso',
        cliques: news.cliques,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
