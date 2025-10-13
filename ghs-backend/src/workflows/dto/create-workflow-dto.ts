import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ example: 1, description: 'ID de la demande' })
  @IsInt()
  @IsNotEmpty({ message: 'L\'ID de la demande est requis' })
  requestID: number;

  @ApiProperty({ example: 1, description: 'ID du validateur' })
  @IsInt()
  @IsNotEmpty({ message: 'L\'ID du validateur est requis' })
  validator: number;

  @ApiProperty({
    example: 2,
    description: 'ID du délégué (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  delegate?: number;

  @ApiProperty({ example: 0, description: 'Statut du workflow' })
  @IsInt()
  @IsNotEmpty({ message: 'Le statut est requis' })
  status: number;
}
