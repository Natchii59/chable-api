import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  Validate,
  ValidateIf,
  ValidateNested
} from 'class-validator'

import {
  CreateChannelName,
  CreateChannelUserIds
} from '@/channels/dto/channels.validators'
import { IsCuid } from '@/lib/decorators/is-cuid.decorator'

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
