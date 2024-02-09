import { Module } from '@nestjs/common'

import { UsersFieldsResolver } from '@/users/users-fields.resolver'
import { UsersMutationsResolver } from '@/users/users-mutations.resolver'
import { UsersQueriesResolver } from './users-queries.resolver'
import { UsersService } from './users.service'

@Module({
  providers: [
    UsersQueriesResolver,
    UsersMutationsResolver,
    UsersFieldsResolver,
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
