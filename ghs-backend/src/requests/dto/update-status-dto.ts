import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RequestStatus } from '../entities/request.entity';

export class UpdateStatusDto {
  @ApiProperty({
    enum: RequestStatus,
    example: RequestStatus.FIRST_LEVEL_APPROVED,
    description: 'Nouveau statut de la demande',
  })
  @IsEnum(RequestStatus, { message: 'Statut invalide' })
  @IsNotEmpty({ message: 'Le statut est requis' })
  status: RequestStatus;
}