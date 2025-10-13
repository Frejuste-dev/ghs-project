import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
  Matches,
} from 'class-validator';
import { ContractType } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'EMP0001',
    description: 'Numéro unique de l\'employé (format: EMP + chiffres)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le numéro d\'employé est requis' })
  @MaxLength(20)
  @Matches(/^EMP\d{4,}$/, {
    message:
      'Le numéro d\'employé doit suivre le format EMP suivi de 4 chiffres minimum',
  })
  employeeNumber: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MaxLength(20)
  lastName: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @MaxLength(30)
  firstName: string;

  @ApiProperty({ example: 1, description: 'ID du service' })
  @IsInt({ message: 'L\'ID du service doit être un entier' })
  @IsNotEmpty({ message: 'Le service est requis' })
  serviceID: number;

  @ApiProperty({
    enum: ContractType,
    example: ContractType.CDI,
    description: 'Type de contrat',
  })
  @IsEnum(ContractType, { message: 'Type de contrat invalide' })
  @IsOptional()
  contractType?: ContractType;

  @ApiProperty({
    example: '+225 01 02 03 04 05',
    description: 'Contact téléphonique (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact?: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Date de naissance (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthdate?: Date;
}
