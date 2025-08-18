import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserModuleDto {
  @ApiProperty({
    description: 'ID do módulo',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  moduleId: string;

  @ApiProperty({
    description: 'Título do módulo',
    example: 'Gestão de Usuários',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Status ativo do módulo para o usuário',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class AddModuleToUserDto {
  @ApiProperty({
    description: 'ID do módulo a ser adicionado',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  moduleId: string;
}

export class UpdateUserModuleDto {
  @ApiProperty({ description: 'Status ativo do módulo', example: false })
  @IsNotEmpty()
  @IsBoolean()
  ativo: boolean;
}
