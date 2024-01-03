// test-auth.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../../util/enums/role.enum';

@Module({})
export class TestAuthModule {
  static forTesting(): DynamicModule {
    const providers = [AuthService];
    const controllers = [AuthController];
    const imports = [
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      }),
    ];

    return {
      module: TestAuthModule,
      imports,
      controllers,
      providers,
      exports: providers,
    };
  }
}
