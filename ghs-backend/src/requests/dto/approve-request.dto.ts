import { IsIn, IsOptional } from 'class-validator';

export class ApproveRequestDto {
  // Niveau d'approbation (1er niveau ou 2e niveau)
  @IsOptional()
  @IsIn([1, 2])
  level?: number;
}
