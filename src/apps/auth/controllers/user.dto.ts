import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
// tslint:disable-next-line:max-classes-per-file

export class User {
  @ApiProperty({ description: 'email', required: true })
  @IsString()
  // @isEmail({})
  email: string;

  // @isNotEmpty()
  @ApiProperty({ description: 'password', required: true })
  @IsString()
  readonly password: string;
  @ApiProperty({ description: '', required: true })
  @IsString()
  readonly fullName: string;

  readonly country: string;
  @ApiProperty({ description: '', required: true })
  @IsString()
  readonly state: number;
}

// tslint:disable-next-line:max-classes-per-file

export class LoginUser {
  @ApiProperty({ description: 'email', required: true })
  @IsString()
  readonly email: string;
  @ApiProperty({ description: 'remember me' })
  readonly rememberMe: boolean;
  @ApiProperty({ description: 'password', required: true })
  @IsString()
  readonly password: string;
}
export class GoogleLoginUserDto {
  providerAccountId: string;
  email: string;
  email_verified: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
  id_token: string;
  expires_in: number;
}
