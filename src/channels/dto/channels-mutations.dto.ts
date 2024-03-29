import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  Length,
  MaxLength,
  Validate,
  ValidateIf,
  ValidateNested
} from 'class-validator'

import {
  CreateChannelName,
  CreateChannelUserIds
} from '@/channels/dto/channels.validators'
import { IsCuid } from '@/lib/decorators/is-cuid.decorator'

@ArgsType()
class ChannelIdArgs {
  @Field(() => String)
  @IsCuid()
  id: string
}

@InputType()
export class CreateChannelInput {
  @Field(() => ChannelType)
  type: ChannelType

  @Field(() => String, { nullable: true })
  @Validate(CreateChannelName)
  name?: string

  @Field(() => [String], { nullable: true })
  @IsCuid({ each: true })
  @Validate(CreateChannelUserIds)
  @ValidateIf(
    (o, v) => (v !== undefined && v !== null) || o.type !== ChannelType.PUBLIC
  )
  userIds?: string[]
}

@ArgsType()
export class CreateChannelArgs {
  @Field(() => CreateChannelInput)
  @ValidateNested()
  @Type(() => CreateChannelInput)
  data: CreateChannelInput
}

@InputType()
export class UpdateChannelData {
  @Field(() => String, { nullable: true })
  @Length(3)
  @ValidateIf((o, v) => v !== undefined && v !== null)
  name?: string

  @Field(() => [String], { nullable: true })
  @MaxLength(250)
  @ValidateIf((o, v) => v !== undefined && v !== null)
  description?: string

  @Field(() => String, { nullable: true })
  @IsCuid()
  @ValidateIf((o, v) => v !== undefined)
  ownerId?: string
}

@ArgsType()
export class UpdateChannelArgs extends ChannelIdArgs {
  @Field(() => UpdateChannelData)
  @ValidateNested()
  @Type(() => UpdateChannelData)
  data: UpdateChannelData
}

@ArgsType()
export class DeleteChannelArgs extends ChannelIdArgs {}

@ArgsType()
export class JoinLeaveChannelArgs extends ChannelIdArgs {
  @Field(() => [String], { nullable: true })
  @IsCuid({ each: true })
  @ValidateIf((o, v) => v !== undefined)
  userIds?: string[]
}

@ArgsType()
export class ReadChannelArgs extends ChannelIdArgs {}
