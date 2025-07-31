import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(senha, user.senha))) {
      const { senha: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.senha);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user._id, nome: user.nome };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    };
  }

  async validateToken(payload: any) {
    return await this.usersService.findOne(payload.sub);
  }
}
