import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { CommonModule } from '~/common/common.module';
import { RoleSeed } from '~/seed/role.seed';
import { UserSeed } from '~/seed/user.seed';

@Module({ imports: [CommandModule, CommonModule], providers: [UserSeed, RoleSeed] })
export class SeedModule {}
