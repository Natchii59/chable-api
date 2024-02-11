import { ArgsType, Field, InputType } from '@nestjs/graphql'
import { Transform, Type } from 'class-transformer'
import {
  IsEmail,
  Length,
  Matches,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal'

import { IsMatchWith } from '@/lib/decorators/match-with.decorator'

@InputType()
export class CreateUserData {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @Length(3, 15)
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      'The username can only contain lowercase letters, numbers, underscores and hyphens'
  })
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  username: string

  @Field(() => String)
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'
  })
  password: string
}

@ArgsType()
export class CreateUserArgs {
  @Field(() => CreateUserData)
  @Type(() => CreateUserData)
  data: CreateUserData
}

@InputType()
export class UpdateUserData {
  @Field(() => String, { nullable: true })
  @IsEmail()
  @ValidateIf((_o, v) => v !== undefined)
  email?: string

  @Field(() => String, { nullable: true })
  @Length(3, 15)
  @Matches(/^[a-z0-9_-]+$/, {
    message:
      'The username can only contain lowercase letters, numbers, underscores and hyphens'
  })
  @ValidateIf((_o, v) => v !== undefined)
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  username?: string

  @Field(() => String, { nullable: true })
  @Length(3, 30)
  @ValidateIf((_o, v) => v !== undefined && v !== null)
  name?: string

  @Field(() => GraphQLUpload, { nullable: true })
  avatar?: Promise<FileUpload>
}

@ArgsType()
export class UpdateUserArgs {
  @Field(() => UpdateUserData)
  @ValidateNested()
  @Type(() => UpdateUserData)
  data: UpdateUserData
}

@InputType()
export class UpdateUserPasswordInput {
  @Field(() => String)
  oldPassword: string

  @Field(() => String)
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'
  })
  password: string

  @Field(() => String)
  @IsMatchWith(UpdateUserPasswordInput, ['password'], {
    message: 'Passwords do not match'
  })
  confirmPassword: string
}

@ArgsType()
export class UpdateUserPasswordArgs {
  @Field(() => UpdateUserPasswordInput)
  @ValidateNested()
  @Type(() => UpdateUserPasswordInput)
  data: UpdateUserPasswordInput
}
