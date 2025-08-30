interface ErrorItem {
  code: number;
  message: string;
}

type ErrorGroup<T extends Record<string, ErrorItem>> = T;

interface AppErrorStatusCodeType {
  INTERNAL_SERVER_ERROR: ErrorItem;
  TIMEOUT: ErrorItem;
  VALIDATION: ErrorItem;
  AUTH: ErrorGroup<{
    JWT_ACCESS_TOKEN: ErrorItem;
    JWT_REFRESH_TOKEN: ErrorItem;
  }>;
  POLICY: ErrorGroup<{
    ABILITY_FORBIDDEN: ErrorItem;
    ROLE_FORBIDDEN: ErrorItem;
  }>;
  CATEGORY: ErrorGroup<{
    NOT_FOUND: ErrorItem;
    SLUG_EXIST: ErrorItem;
  }>;
}

export const AppErrorStatusCode: AppErrorStatusCodeType = {
  // server
  INTERNAL_SERVER_ERROR: {
    code: 5000,
    message: 'Internal server error'
  },
  TIMEOUT: {
    code: 5031,
    message: 'Request timeout'
  },
  VALIDATION: {
    code: 4000,
    message: 'Validation failed'
  },

  // auth
  AUTH: {
    JWT_ACCESS_TOKEN: { code: 5100, message: 'Invalid access token' },
    JWT_REFRESH_TOKEN: { code: 5101, message: 'Invalid refresh token' }
  },

  // policy
  POLICY: {
    ABILITY_FORBIDDEN: { code: 5050, message: 'You do not have permission to perform this action' },
    ROLE_FORBIDDEN: { code: 5051, message: 'Your role does not grant access to this resource' }
  },
  CATEGORY: {
    NOT_FOUND: { code: 4001, message: 'Category not found' },
    SLUG_EXIST: { code: 4002, message: 'Category with this slug already exists' }
  }
};
