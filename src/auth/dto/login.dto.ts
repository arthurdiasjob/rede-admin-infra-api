import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email do usuário', example: 'joao@exemplo.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123456' })
  @IsNotEmpty()
  @IsString()
  senha: string;
}
