import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsEmail, Length } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @Length(3, 15)
  username: string

  @Field(() => String)
  password: string
}

@ArgsType()
export class CreateUserArgs {
  @Field(() => CreateUserInput)
  @Type(() => CreateUserInput)
  where: CreateUserInput
}
