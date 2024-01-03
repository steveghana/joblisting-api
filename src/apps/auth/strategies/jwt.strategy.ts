import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from '../../constants/constants';
import { ConfigService } from '@nestjs/config';
export class UserJwt {
  sub: string;
  id_token: string;
  access_token: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'HR' | 'Marketing' | 'Developers';
  expires_at: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('APP_JWT_SECRET'),
    });
  }

  async validate(payload: UserJwt) {
    return {
      userId: payload.sub,
      firstName: payload.firstName,
      role: payload.role,
    };
  }
}
