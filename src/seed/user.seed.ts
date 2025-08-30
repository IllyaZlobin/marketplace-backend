import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Command } from 'nestjs-command';
import { EntityManager } from 'typeorm';

import { PolicyRoleType } from '~/app/policy/constants';
import { IConfig } from '~/common/config/types';
import { randomSalt, bcrypt } from '~/common/utils/hash';
import { RoleEntity, UserEntity } from '~/persistence/entities';

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(UserSeed.name);

  constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly configService: ConfigService<IConfig, true>
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seed users'
  })
  async execute(): Promise<void> {
    const saltLength = this.configService.get('auth.saltLength', { infer: true });
    const salt = randomSalt(saltLength);
    const password: string = 'Qwerty_11';
    const passwordHash = bcrypt(password, salt);

    const superAdminRole = await this.em.findOne(RoleEntity, {
      where: { type: PolicyRoleType.SUPER_ADMIN, isActive: true },
      select: { id: true }
    });
    if (!superAdminRole) {
      this.logger.warn(`Super-admin role not found. Can't create new super-admin user`);
      return;
    }
    const superAdminCount = await this.em.count(UserEntity, { where: { roleId: superAdminRole.id } });
    if (superAdminCount) return;
    await this.em.save(UserEntity, {
      name: 'Admin',
      email: 'admin@admin.com',
      passwordHash,
      roleId: superAdminRole.id
    });
    this.logger.log('User was created!');
  }
}
