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
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo módulo' })
  @ApiResponse({ status: 201, description: 'Módulo criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Módulo já existe.' })
  async create(@Body() createModuleDto: CreateModuleDto) {
    try {
      // Verificar se já existe um módulo com o mesmo título
      const existingModule = await this.modulesService.findByTitulo(
        createModuleDto.titulo,
      );
      if (existingModule) {
        throw new HttpException(
          'Módulo com este título já existe',
          HttpStatus.CONFLICT,
        );
      }

      return await this.modulesService.create(createModuleDto);
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
  @ApiOperation({ summary: 'Listar todos os módulos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos retornada com sucesso.',
  })
  async findAll() {
    try {
      return await this.modulesService.findAll();
    } catch {
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar módulo por ID' })
  @ApiResponse({ status: 200, description: 'Módulo encontrado.' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado.' })
  async findOne(@Param('id') id: string) {
    try {
      const module = await this.modulesService.findOne(id);
      if (!module) {
        throw new HttpException('Módulo não encontrado', HttpStatus.NOT_FOUND);
      }
      return module;
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
  @ApiOperation({ summary: 'Atualizar módulo' })
  @ApiResponse({ status: 200, description: 'Módulo atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Título já existe em outro módulo.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    try {
      // Se está atualizando o título, verificar se não existe em outro módulo
      if (updateModuleDto.titulo) {
        const existingModule = await this.modulesService.findByTitulo(
          updateModuleDto.titulo,
        );
        if (existingModule && (existingModule._id as any).toString() !== id) {
          throw new HttpException(
            'Módulo com este título já existe',
            HttpStatus.CONFLICT,
          );
        }
      }

      const updatedModule = await this.modulesService.update(
        id,
        updateModuleDto,
      );
      if (!updatedModule) {
        throw new HttpException('Módulo não encontrado', HttpStatus.NOT_FOUND);
      }
      return updatedModule;
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
  @ApiOperation({ summary: 'Deletar módulo' })
  @ApiResponse({ status: 200, description: 'Módulo deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado.' })
  async remove(@Param('id') id: string) {
    try {
      const deletedModule = await this.modulesService.remove(id);
      if (!deletedModule) {
        throw new HttpException('Módulo não encontrado', HttpStatus.NOT_FOUND);
      }
      return { message: 'Módulo deletado com sucesso' };
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
