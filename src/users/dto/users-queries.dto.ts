import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEmail, Length, ValidateIf } from 'class-validator'

import { IsCuid } from '@/lib/decorators/is-cuid.decorator'
import {
  DateTimeFilter,
  SortOrder,
  SortOrderInput,
  StringFilter
} from '@/lib/prisma-dto'
import { User } from '@/users/models/user.model'

@InputType()
export class UserWhereUniqueInput {
  @Field(() => String, { nullable: true })
  @IsCuid()
  @ValidateIf((o, v) => v !== undefined)
  id?: string

  @Field(() => String, { nullable: true })
  @IsEmail()
  @ValidateIf((o, v) => v !== undefined)
  email?: string

  @Field(() => String, { nullable: true })
  @Length(3)
  @ValidateIf((o, v) => v !== undefined)
  username?: string
}

@InputType()
export class UserWhereInput {
  @Field(() => [UserWhereInput], { nullable: true })
  AND?: Array<UserWhereInput>

  @Field(() => [UserWhereInput], { nullable: true })
  OR?: Array<UserWhereInput>

  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: Array<UserWhereInput>

  @Field(() => StringFilter, { nullable: true })
  id?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  username?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter
}

@InputType()
export class UserListRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  every?: UserWhereInput

  @Field(() => UserWhereInput, { nullable: true })
  some?: UserWhereInput

  @Field(() => UserWhereInput, { nullable: true })
  none?: UserWhereInput
}

@InputType()
export class UserOrderByInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  username?: keyof typeof SortOrder

  @Field(() => SortOrderInput, { nullable: true })
  name?: SortOrderInput

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder
}

@InputType()
export class UserOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  username?: keyof typeof SortOrder

  @Field(() => SortOrderInput, { nullable: true })
  name?: SortOrderInput

  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder

  @Field(() => SortOrderInput, { nullable: true })
  avatarKey?: SortOrderInput

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder
}

@ArgsType()
export class FindUniqueUserArgs {
  @Field(() => UserWhereUniqueInput)
  @Type(() => UserWhereUniqueInput)
  where: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email' | 'username'>
}

@ArgsType()
export class FindManyUserArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: UserWhereInput

  @Field(() => [UserOrderByInput], { nullable: true })
  orderBy?: Array<UserOrderByInput>

  @Field(() => Int, { nullable: true })
  take?: number

  @Field(() => Int, { nullable: true })
  skip?: number
}

@ObjectType()
export class FindManyUserObject {
  @Field(() => [User])
  users: User[]
}
