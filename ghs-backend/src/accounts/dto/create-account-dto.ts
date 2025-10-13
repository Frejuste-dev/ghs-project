import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserProfile } from '../entities/account.entity';

export class CreateAccountDto {
  @ApiProperty({ example: 1, description: 'ID de l\'employé' })
  @IsInt({ message: 'L\'ID de l\'employé doit être un entier' })
  @IsNotEmpty({ message: 'L\'ID de l\'employé est requis' })
  employeeID: number;

  @ApiProperty({
    example: 'jdupont',
    description: 'Nom d\'utilisateur (3-50 caractères)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis' })
  @MinLength(3, {
    message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
  })
  @MaxLength(50, {
    message: 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères',
  })
  @Matches(/^[a-zA-Z0-9_-]{3,50}$/, {
    message:
      'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores',
  })
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Mot de passe (minimum 6 caractères)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiProperty({
    enum: UserProfile,
    example: UserProfile.VALIDATOR,
    description: 'Profil utilisateur',
  })
  @IsEnum(UserProfile, { message: 'Profil invalide' })
  @IsOptional()
  profile?: UserProfile;
}