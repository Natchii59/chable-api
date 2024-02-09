import { Resolver } from '@nestjs/graphql'

import { UsersService } from '@/users/users.service'

@Resolver()
export class UsersFieldsResolver {
  constructor(private userService: UsersService) {}
}
