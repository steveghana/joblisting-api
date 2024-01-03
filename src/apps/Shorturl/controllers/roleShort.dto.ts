import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
export class Short {
  @IsNotEmpty()
  @IsString()
  shortComponent: string;
}
export class RoleShort {
  @Type(() => Short)
  @ValidateNested()
  @IsNotEmpty()
  public query?: Short;
}
