import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Command } from 'nestjs-command';
import { EntityManager } from 'typeorm';

import { PolicyAction, PolicyRoleType, PolicySubject } from '~/app/policy/constants';
import { RoleEntity } from '~/persistence/entities/role.entity';

@Injectable()
export class RoleSeed {
  private readonly logger = new Logger(RoleSeed.name);

  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  @Command({ command: 'seed:role', describe: 'Seed roles' })
  async execute() {
    const rolesCount = await this.em.count(RoleEntity);
    if (rolesCount > 0) {
      this.logger.log('Roles already seeded');
      return;
    }
    await this.em.save(RoleEntity, [
      {
        name: 'Super Admin',
        description: 'Super Admin role',
        isActive: true,
        type: PolicyRoleType.SUPER_ADMIN,
        permissions: [
          {
            subject: PolicySubject.AUTH,
            actions: [PolicyAction.MANAGE]
          },
          {
            subject: PolicySubject.USER,
            actions: [PolicyAction.MANAGE]
          },
          {
            subject: PolicySubject.ROLE,
            actions: [PolicyAction.MANAGE]
          }
        ]
      },
      {
        name: 'Admin',
        description: 'Admin role',
        isActive: true,
        type: PolicyRoleType.ADMIN
      },
      {
        name: 'Vendor',
        description: 'Vendor role',
        isActive: true,
        type: PolicyRoleType.VENDOR
      },
      {
        name: 'Customer',
        description: 'Customer role',
        isActive: true,
        type: PolicyRoleType.CUSTOMER
      }
    ]);
    this.logger.log('Roles seeded successfully');
  }
}
