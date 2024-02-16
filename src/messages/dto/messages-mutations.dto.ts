import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { Transform, Type } from 'class-transformer'
import { ValidateIf, ValidateNested } from 'class-validator'

import { IsCuid } from '@/lib/decorators/is-cuid.decorator'

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  @Transform(({ value }) => value.trim())
  text: string

  @Field(() => String)
  @IsCuid()
  channelId: string
}

@ArgsType()
export class CreateMessageArgs {
  @Field(() => CreateMessageInput)
  @ValidateNested()
  @Type(() => CreateMessageInput)
  data: CreateMessageInput
}

@InputType()
export class UpdateMessageInput {
  @Field(() => String, { nullable: true })
  @Transform(({ value }) => value.trim())
  @ValidateIf((o, v) => v !== undefined)
  text: string
}

@ArgsType()
export class UpdateMessageArgs {
  @Field(() => String)
  @IsCuid()
  id: string

  @Field(() => UpdateMessageInput)
  @ValidateNested()
  @Type(() => UpdateMessageInput)
  data: UpdateMessageInput
}

@ArgsType()
export class DeleteMessageArgs {
  @Field(() => String)
  @IsCuid()
  id: string
}
