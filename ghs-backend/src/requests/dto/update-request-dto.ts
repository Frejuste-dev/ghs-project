import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';

export class UpdateRequestDto extends PartialType(
  OmitType(CreateRequestDto, ['employeeID'] as const),
) {}
