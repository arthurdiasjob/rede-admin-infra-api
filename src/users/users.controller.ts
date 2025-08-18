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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddModuleToUserDto, UpdateUserModuleDto } from './dto/user-module.dto';
import { ModulesService } from '../modules/modules.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly modulesService: ModulesService,
  ) {}

  @Post('bootstrap')
  @ApiOperation({ summary: 'Criar primeiro usuário do sistema (bootstrap)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Primeiro usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async bootstrap(@Body() createUserDto: CreateUserDto) {
    // Verificar se já existem usuários
    const existingUsers = await this.usersService.findAll();
    if (existingUsers.length > 0) {
      throw new HttpException('Sistema já possui usuários cadastrados', HttpStatus.CONFLICT);
    }
    return this.usersService.create(createUserDto);
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Temporariamente removido
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  // @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuário removido com sucesso' };
  }

  // Rotas para gerenciar módulos do usuário
  @Get(':id/modules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar módulos do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de módulos do usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async getUserModules(@Param('id') id: string) {
    try {
      return await this.usersService.getUserModules(id);
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

  @Post(':id/modules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar módulo ao usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: AddModuleToUserDto })
  @ApiResponse({ status: 201, description: 'Módulo adicionado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário ou módulo não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async addModuleToUser(
    @Param('id') id: string,
    @Body() addModuleDto: AddModuleToUserDto,
  ) {
    try {
      // Verificar se o módulo existe
      const module = await this.modulesService.findOne(addModuleDto.moduleId);
      if (!module) {
        throw new HttpException('Módulo não encontrado', HttpStatus.NOT_FOUND);
      }

      return await this.usersService.addModuleToUser(
        id,
        addModuleDto,
        module.titulo,
      );
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

  @Patch(':id/modules/:moduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar módulo do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiParam({ name: 'moduleId', description: 'ID do módulo' })
  @ApiBody({ type: UpdateUserModuleDto })
  @ApiResponse({ status: 200, description: 'Módulo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário ou módulo não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async updateUserModule(
    @Param('id') id: string,
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateUserModuleDto,
  ) {
    try {
      return await this.usersService.updateUserModule(
        id,
        moduleId,
        updateModuleDto,
      );
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

  @Delete(':id/modules/:moduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover módulo do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiParam({ name: 'moduleId', description: 'ID do módulo' })
  @ApiResponse({ status: 200, description: 'Módulo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  async removeModuleFromUser(
    @Param('id') id: string,
    @Param('moduleId') moduleId: string,
  ) {
    try {
      await this.usersService.removeModuleFromUser(id, moduleId);
      return { message: 'Módulo removido do usuário com sucesso' };
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
