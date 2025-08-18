import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LogosService } from './logos.service';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('logos')
@Controller('logos')
export class LogosController {
  constructor(private readonly logosService: LogosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova logomarca' })
  @ApiResponse({ status: 201, description: 'Logomarca criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Logomarca já existe.' })
  async create(@Body() createLogoDto: CreateLogoDto) {
    try {
      // Verificar se já existe uma logomarca com o mesmo título
      const existingLogo = await this.logosService.findByTitulo(
        createLogoDto.titulo,
      );
      if (existingLogo) {
        throw new HttpException(
          'Logomarca com este título já existe',
          HttpStatus.CONFLICT,
        );
      }

      return await this.logosService.create(createLogoDto);
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

  @Get()
  @ApiOperation({ summary: 'Listar todas as logomarcas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de logomarcas retornada com sucesso.',
  })
  async findAll() {
    try {
      return await this.logosService.findAll();
    } catch {
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar logomarca por ID' })
  @ApiResponse({ status: 200, description: 'Logomarca encontrada.' })
  @ApiResponse({ status: 404, description: 'Logomarca não encontrada.' })
  async findOne(@Param('id') id: string) {
    try {
      const logo = await this.logosService.findOne(id);
      if (!logo) {
        throw new HttpException(
          'Logomarca não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return logo;
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar logomarca' })
  @ApiResponse({
    status: 200,
    description: 'Logomarca atualizada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Logomarca não encontrada.' })
  @ApiResponse({
    status: 409,
    description: 'Título já existe em outra logomarca.',
  })
  async update(@Param('id') id: string, @Body() updateLogoDto: UpdateLogoDto) {
    try {
      // Se está atualizando o título, verificar se não existe em outra logomarca
      if (updateLogoDto.titulo) {
        const existingLogo = await this.logosService.findByTitulo(
          updateLogoDto.titulo,
        );
        if (existingLogo && (existingLogo._id as any).toString() !== id) {
          throw new HttpException(
            'Logomarca com este título já existe',
            HttpStatus.CONFLICT,
          );
        }
      }

      const updatedLogo = await this.logosService.update(id, updateLogoDto);
      if (!updatedLogo) {
        throw new HttpException(
          'Logomarca não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedLogo;
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar logomarca' })
  @ApiResponse({ status: 200, description: 'Logomarca deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Logomarca não encontrada.' })
  async remove(@Param('id') id: string) {
    try {
      const deletedLogo = await this.logosService.remove(id);
      if (!deletedLogo) {
        throw new HttpException(
          'Logomarca não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return { message: 'Logomarca deletada com sucesso' };
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
