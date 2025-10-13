import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'IT01',
    description: 'Code unique du service (majuscules et chiffres)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le code service est requis' })
  @MaxLength(10, {
    message: 'Le code service ne peut pas dépasser 10 caractères',
  })
  @Matches(/^[A-Z0-9]+$/, {
    message:
      'Le code service doit être alphanumérique (majuscules et chiffres uniquement)',
  })
  serviceCode: string;

  @ApiProperty({
    example: 'Service Informatique',
    description: 'Nom du service',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du service est requis' })
  @MaxLength(100, {
    message: 'Le nom du service ne peut pas dépasser 100 caractères',
  })
  serviceName: string;

  @ApiProperty({
    example: 1,
    description: 'ID du service parent (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'L\'ID du service parent doit être un entier' })
  parentServiceID?: number;

  @ApiProperty({
    example: 'Gestion de l\'infrastructure IT',
    description: 'Description du service (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Jean Dupont',
    description: 'Nom du responsable (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  manager?: string;
}
