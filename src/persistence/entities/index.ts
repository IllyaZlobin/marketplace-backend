export * from './user.entity';
export * from './role.entity';
export * from './permission.entity';

import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

export const ENTITIES = [UserEntity, RoleEntity, PermissionEntity];
