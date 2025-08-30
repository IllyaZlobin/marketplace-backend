import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { PolicySubject, PolicyAction } from '~/app/policy/constants';
import { RoleEntity } from '~/persistence/entities/role.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryColumn({ name: 'role_id', type: 'int' })
  roleId: string;

  @PrimaryColumn({ type: 'enum', enum: PolicySubject })
  subject: PolicySubject;

  @Column({ type: 'enum', enum: PolicyAction, array: true })
  actions: PolicyAction[];

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at'
  })
  updatedAt: Date;

  //#region Relations

  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  //#endregion
}
