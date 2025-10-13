import { SetMetadata } from '@nestjs/common';
import { UserProfile } from '../../accounts/entities/account.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserProfile[]) => SetMetadata(ROLES_KEY, roles);
