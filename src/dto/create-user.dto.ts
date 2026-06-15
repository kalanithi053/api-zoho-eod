// dto/create-user.dto.ts
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";

export class UserConfigurationDto {
  @IsOptional()
  @IsBoolean()
  validatedGoogle?: boolean;

  @IsOptional()
  @IsString()
  googleRefreshToken?: string;

  @IsOptional()
  @IsBoolean()
  validatedZoho?: boolean;

  @IsOptional()
  @IsString()
  zohoRefreshToken?: string;

  @IsOptional()
  @IsString()
  cronOption?: string;
}

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsUrl()
  userProfileUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserConfigurationDto)
  configuration?: UserConfigurationDto;
}
