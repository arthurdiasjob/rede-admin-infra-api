import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Título do módulo',
    example: 'Gestão de Usuários',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'URL do módulo (opcional)',
    example: 'https://www.exemplo.com/modulo',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}
