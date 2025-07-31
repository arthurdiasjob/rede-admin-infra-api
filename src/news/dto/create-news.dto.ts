import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Título da notícia',
    example: 'Nova tecnologia revoluciona mercado',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Subtítulo da notícia',
    example: 'Inovação promete mudanças significativas',
  })
  @IsNotEmpty()
  @IsString()
  subtitulo: string;

  @ApiProperty({
    description: 'Imagem em base64',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  })
  @IsNotEmpty()
  @IsString()
  imagem: string; // base64

  @ApiProperty({
    description: 'Data de publicação da notícia',
    example: '2025-01-15T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  dataPublicacao: Date;

  @ApiProperty({
    description: 'Link da notícia',
    example: 'https://exemplo.com/noticia',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty({ description: 'Veículo de mídia', example: 'TechNews' })
  @IsNotEmpty()
  @IsString()
  veiculoMidia: string;

  @ApiProperty({
    description: 'Status de ativação da notícia',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'ID do usuário que cadastrou a notícia',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  usuarioCadastro: string;
}
