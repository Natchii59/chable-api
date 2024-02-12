import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'

@ObjectType()
export class Channel {
  @Field(() => ID)
  id: string

  @Field(() => ChannelType)
  type: ChannelType

  @Field(() => String, { nullable: true })
  name: string | null

  @Field(() => String, { nullable: true })
  description: string | null

  @Field(() => String, { nullable: true })
  ownerId: string | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
