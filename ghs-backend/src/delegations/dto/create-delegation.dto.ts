import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateDelegationDto {
  @ApiProperty({ example: 1, description: 'ID de l\'employé qui délègue' })
  @IsInt()
  @IsNotEmpty({ message: 'L\'ID de l\'employé délégant est requis' })
  delegatedBy: number;

  @ApiProperty({ example: 2, description: 'ID de l\'employé délégué' })
  @IsInt()
  @IsNotEmpty({ message: 'L\'ID de l\'employé délégué est requis' })
  delegatedTo: number;

  @ApiProperty({
    example: '2025-10-05',
    description: 'Date de début de la délégation',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'La date de début est requise' })
  startAt: Date;

  @ApiProperty({
    example: '2025-10-15',
    description: 'Date de fin de la délégation',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'La date de fin est requise' })
  endAt: Date;
}
