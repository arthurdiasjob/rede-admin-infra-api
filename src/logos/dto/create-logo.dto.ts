import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogoDto {
  @ApiProperty({
    description: 'Título da logomarca',
    example: 'Empresa Exemplo',
  })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    description: 'Imagem em base64',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  })
  @IsNotEmpty()
  @IsString()
  imagem: string; // base64

  @ApiProperty({
    description: 'URL da empresa (opcional)',
    example: 'https://www.exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}
