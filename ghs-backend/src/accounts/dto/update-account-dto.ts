import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDto extends PartialType(
  OmitType(CreateAccountDto, ['employeeID'] as const),
) {
  @ApiProperty({
    example: true,
    description: 'Compte actif ou non',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}