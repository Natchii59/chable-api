import { Injectable } from '@nestjs/common'

import { compareHash } from '@/lib/hash'
import { UsersService } from '@/users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser({ email })

    if (!user) {
      return null
    }

    const isPasswordValid = await compareHash(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    return {
      userId: user.id
    }
  }
}
