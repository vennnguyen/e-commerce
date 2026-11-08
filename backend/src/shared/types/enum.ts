// Literal values keep Swagger metadata independent of source-file paths.
export const UserRole = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  UNREGISTER: 'unregister',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
