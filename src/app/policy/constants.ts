export enum PolicyRoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'customer'
}

export enum PolicyAction {
  MANAGE = 'manage',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum PolicySubject {
  USER = 'user',
  ROLE = 'role',
  AUTH = 'auth',
  PRODUCT = 'product',
  CATEGORY = 'category',
  ORDER = 'order'
}
