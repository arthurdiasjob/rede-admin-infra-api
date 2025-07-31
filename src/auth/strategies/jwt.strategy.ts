import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // Em produção, use variável de ambiente
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateToken(payload);
    if (!user) {
      return null;
    }
    return { userId: payload.sub, email: payload.email, nome: payload.nome };
  }
}
