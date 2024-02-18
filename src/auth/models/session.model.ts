import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Session {
  @Field(() => ID)
  id: string

  @Field(() => String)
  browser: string

  @Field(() => String)
  os: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
