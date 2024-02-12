import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'
import { Type } from 'class-transformer'

import { Channel } from '@/channels/models/channel.model'
import { IsCuid } from '@/lib/decorators/is-cuid.decorator'
import {
  DateTimeFilter,
  SortOrder,
  SortOrderInput,
  StringFilter
} from '@/lib/prisma-dto'
import {
  UserListRelationFilter,
  UserOrderByWithRelationInput,
  UserWhereInput
} from '@/users/dto/users-queries.dto'

@InputType()
export class EnumChannelTypeFilter {
  @Field(() => ChannelType, { nullable: true })
  equals?: keyof typeof ChannelType;

  @Field(() => [ChannelType], { nullable: true })
  in?: Array<keyof typeof ChannelType>

  @Field(() => [ChannelType], { nullable: true })
  notIn?: Array<keyof typeof ChannelType>

  @Field(() => EnumChannelTypeFilter, { nullable: true })
  not?: EnumChannelTypeFilter
}

@InputType()
export class ChannelWhereInput {
  @Field(() => [ChannelWhereInput], { nullable: true })
  AND?: Array<ChannelWhereInput>

  @Field(() => [ChannelWhereInput], { nullable: true })
  OR?: Array<ChannelWhereInput>

  @Field(() => [ChannelWhereInput], { nullable: true })
  NOT?: Array<ChannelWhereInput>

  @Field(() => StringFilter, { nullable: true })
  id?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  description?: StringFilter

  @Field(() => EnumChannelTypeFilter, { nullable: true })
  type?: EnumChannelTypeFilter

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter

  @Field(() => StringFilter, { nullable: true })
  ownerId?: StringFilter

  @Field(() => UserWhereInput, { nullable: true })
  owner?: UserWhereInput

  @Field(() => UserListRelationFilter, { nullable: true })
  users?: UserListRelationFilter
}

@InputType()
export class ChannelOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder

  @Field(() => SortOrderInput, { nullable: true })
  name?: SortOrderInput

  @Field(() => SortOrderInput, { nullable: true })
  description?: SortOrderInput

  @Field(() => SortOrder, { nullable: true })
  type?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder

  @Field(() => SortOrderInput, { nullable: true })
  ownerId?: SortOrderInput

  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  owner?: UserOrderByWithRelationInput
}

@ArgsType()
export class GetChannelArgs {
  @Field(() => String)
  @IsCuid()
  id: string
}

@ArgsType()
export class FindManyChannelsArgs {
  @Field(() => ChannelWhereInput, { nullable: true })
  @Type(() => ChannelWhereInput)
  where?: ChannelWhereInput

  @Field(() => [ChannelOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<ChannelOrderByWithRelationInput>

  @Field(() => Int, { nullable: true })
  take?: number

  @Field(() => Int, { nullable: true })
  skip?: number
}

@ObjectType()
export class FindManyChannelsObject {
  @Field(() => [Channel])
  channels: Channel[]
}
