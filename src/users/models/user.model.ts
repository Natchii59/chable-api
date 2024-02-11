import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field(() => String)
  email: string

  @Field(() => String)
  username: string

  @Field(() => String, { nullable: true })
  name: string | null

  @Field(() => String, { nullable: true })
  avatarKey: string | null

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
