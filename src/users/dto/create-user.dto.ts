import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao@exemplo.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;
}
