import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { FileUpload } from 'graphql-upload-minimal'

import { DatabaseService } from '@/database/database.service'
import { compareHash, hashString } from '@/lib/hash'
import { UploadsService } from '@/uploads/uploads.service'

@Injectable()
export class UsersService {
  constructor(
    private db: DatabaseService,
    private upload: UploadsService
  ) {}

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
        this.verifyUserPrismaError(err)
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

  countUsers(where: Prisma.UserWhereInput) {
    return this.db.user.count({ where })
  }

  async updateUser(
    id: string,
    data: Prisma.UserUncheckedUpdateInput & {
      avatar?: Promise<FileUpload> | null
    }
  ) {
    try {
      const { avatar, ...restData } = data
      let avatarKey: string | null = undefined

      if (data.avatar !== undefined) {
        avatarKey = await this.updateUserAvatar(id, avatar)
      }

      return await this.db.user.update({
        where: { id },
        data: {
          ...restData,
          avatarKey
        }
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.verifyUserPrismaError(err)
      } else {
        throw err
      }
    }
  }

  async updateUserAvatar(
    userId: string,
    avatar: Promise<FileUpload> | null
  ): Promise<string | null> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { avatarKey: true }
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (user.avatarKey) {
      await this.upload.deleteFile('avatars', user.avatarKey)
    }

    if (!avatar) {
      return null
    }

    return this.upload.uploadFile('avatars', avatar, {
      width: 512,
      height: 512
    })
  }

  async updateUserPassword(
    id: string,
    data: { password: string; oldPassword: string; refreshTokenId: string }
  ) {
    const user = await this.db.user.findUnique({ where: { id } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const isPasswordValid = await compareHash(data.oldPassword, user.password)

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password')
    }

    const hashedPassword = await hashString(data.password)

    const userUpdated = await this.db.user.update({
      where: { id },
      data: { password: hashedPassword }
    })

    await this.db.session.deleteMany({
      where: {
        userId: id,
        id: { not: data.refreshTokenId }
      }
    })

    return userUpdated
  }

  deleteUser(id: string) {
    return this.db.user.delete({ where: { id } })
  }

  private verifyUserPrismaError(err: Prisma.PrismaClientKnownRequestError) {
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
  }
}
