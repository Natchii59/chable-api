import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string

  @Field(() => String)
  text: string

  @Field(() => String)
  authorId: string

  @Field(() => String)
  channelId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
