import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator
 * @param roles - allowed roles for this route
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
