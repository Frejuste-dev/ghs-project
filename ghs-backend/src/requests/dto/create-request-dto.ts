import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsString,
  IsOptional,
  Matches,
} from 'class-validator';
import { MaxWorkHours } from '../../common/validators/business-validators';

export class CreateRequestDto {
  @ApiProperty({ example: 1, description: 'ID de l\'employé' })
  @IsInt({ message: 'L\'ID de l\'employé doit être un entier' })
  @IsNotEmpty({ message: 'L\'ID de l\'employé est requis' })
  employeeID: number;

  @ApiProperty({
    example: '2025-10-05',
    description: 'Date de la demande (format: YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'La date de la demande est requise' })
  requestDate: Date;

  @ApiProperty({
    example: '08:00',
    description: 'Heure de début précédente (optionnel, format: HH:MM)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'L\'heure de début précédente doit être au format HH:MM',
  })
  previousStart?: string;

  @ApiProperty({
    example: '17:00',
    description: 'Heure de fin précédente (optionnel, format: HH:MM)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'L\'heure de fin précédente doit être au format HH:MM',
  })
  previousEnd?: string;

  @ApiProperty({
    example: '08:00',
    description: 'Heure de début (format: HH:MM)',
  })
  @IsString()
  @IsNotEmpty({ message: 'L\'heure de début est requise' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'L\'heure de début doit être au format HH:MM',
  })
  startAt: string;

  @ApiProperty({
    example: '20:00',
    description: 'Heure de fin (format: HH:MM, max 12h après le début)',
  })
  @IsString()
  @IsNotEmpty({ message: 'L\'heure de fin est requise' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'L\'heure de fin doit être au format HH:MM',
  })
  @MaxWorkHours('startAt', {
    message: 'La durée de travail ne peut pas excéder 12 heures',
  })
  endAt: string;

  @ApiProperty({
    example: 'Travail urgent sur un projet client',
    description: 'Commentaire ou justification (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
