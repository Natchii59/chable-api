import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'
import { hashString } from '@/lib/hash'

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async createUser(input: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await hashString(input.password)

      return await this.db.user.create({
        data: {
          ...input,
          password: hashedPassword
        }
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const target = err.meta.target as string[]

          if (target.includes('email')) {
            throw new BadRequestException('Email already exists')
          } else if (target.includes('username')) {
            throw new BadRequestException('Username already exists')
          } else {
            throw new BadRequestException('User already exists')
          }
        }
      } else {
        throw new HttpException('Internal Server Error', 500)
      }
    }
  }

  getUser(where: Prisma.UserWhereUniqueInput) {
    return this.db.user.findUnique({ where })
  }

  getUsers(args: Prisma.UserFindManyArgs) {
    return this.db.user.findMany(args)
  }

  countUsers(args: Prisma.UserCountArgs) {
    return this.db.user.count(args)
  }

  updateUser(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.db.user.update({
      where: { id },
      data
    })
  }
}
