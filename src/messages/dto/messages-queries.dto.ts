import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import {
  ChannelOrderByWithRelationInput,
  ChannelWhereInput
} from '@/channels/dto/channels-queries.dto'
import { IsCuid } from '@/lib/decorators/is-cuid.decorator'
import { DateTimeFilter, SortOrder, StringFilter } from '@/lib/prisma-dto'
import { Message } from '@/messages/models/message.model'
import {
  UserListRelationFilter,
  UserOrderByWithRelationInput,
  UserWhereInput
} from '@/users/dto/users-queries.dto'

@InputType()
export class MessageWhereInput {
  @Field(() => [MessageWhereInput], { nullable: true })
  AND?: Array<MessageWhereInput>

  @Field(() => [MessageWhereInput], { nullable: true })
  OR?: Array<MessageWhereInput>

  @Field(() => [MessageWhereInput], { nullable: true })
  NOT?: Array<MessageWhereInput>

  @Field(() => StringFilter, { nullable: true })
  id?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  text?: StringFilter

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter

  @Field(() => StringFilter, { nullable: true })
  authorId?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  channelId?: StringFilter

  @Field(() => UserWhereInput, { nullable: true })
  author?: UserWhereInput

  @Field(() => ChannelWhereInput, { nullable: true })
  channel?: ChannelWhereInput

  @Field(() => UserListRelationFilter, { nullable: true })
  readBy?: UserListRelationFilter
}

@InputType()
export class MessageOrderByWithRelationInput {
  @Field(() => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  text?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  authorId?: keyof typeof SortOrder

  @Field(() => SortOrder, { nullable: true })
  channelId?: keyof typeof SortOrder

  @Field(() => UserOrderByWithRelationInput, { nullable: true })
  author?: UserOrderByWithRelationInput

  @Field(() => ChannelOrderByWithRelationInput, { nullable: true })
  channel?: ChannelOrderByWithRelationInput
}

@ArgsType()
export class FindUniqueMessageArgs {
  @Field(() => String)
  @IsCuid()
  id: string
}

@ArgsType()
export class FindManyMessageArgs {
  @Field(() => MessageWhereInput, { nullable: true })
  @Type(() => MessageWhereInput)
  where?: MessageWhereInput

  @Field(() => [MessageOrderByWithRelationInput], { nullable: true })
  orderBy?: Array<MessageOrderByWithRelationInput>

  @Field(() => Int, { nullable: true })
  take?: number

  @Field(() => Int, { nullable: true })
  skip?: number
}

@ObjectType()
export class FindManyMessagesObject {
  @Field(() => [Message])
  messages: Message[]
}
