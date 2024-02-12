import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'

export enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}

registerEnumType(SortOrder, { name: 'SortOrder' })

export enum NullsOrder {
  first = 'first',
  last = 'last'
}

registerEnumType(NullsOrder, { name: 'NullsOrder' })

export enum QueryMode {
  'default' = 'default',
  insensitive = 'insensitive'
}

registerEnumType(QueryMode, { name: 'QueryMode' })

registerEnumType(ChannelType, { name: 'ChannelType' })

@InputType()
export class SortOrderInput {
  @Field(() => SortOrder)
  sort: keyof typeof SortOrder

  @Field(() => NullsOrder, { nullable: true })
  nulls?: keyof typeof NullsOrder
}

@InputType()
export class StringFilter {
  @Field(() => String, { nullable: true })
  equals?: string;

  @Field(() => [String], { nullable: true })
  in?: Array<string>

  @Field(() => [String], { nullable: true })
  notIn?: Array<string>

  @Field(() => String, { nullable: true })
  lt?: string

  @Field(() => String, { nullable: true })
  lte?: string

  @Field(() => String, { nullable: true })
  gt?: string

  @Field(() => String, { nullable: true })
  gte?: string

  @Field(() => String, { nullable: true })
  contains?: string

  @Field(() => String, { nullable: true })
  startsWith?: string

  @Field(() => String, { nullable: true })
  endsWith?: string

  @Field(() => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode

  @Field(() => StringFilter, { nullable: true })
  not?: StringFilter
}

@InputType()
export class DateTimeFilter {
  @Field(() => Date, { nullable: true })
  equals?: Date | string;

  @Field(() => [Date], { nullable: true })
  in?: Array<Date> | Array<string>

  @Field(() => [Date], { nullable: true })
  notIn?: Array<Date> | Array<string>

  @Field(() => Date, { nullable: true })
  lt?: Date | string

  @Field(() => Date, { nullable: true })
  lte?: Date | string

  @Field(() => Date, { nullable: true })
  gt?: Date | string

  @Field(() => Date, { nullable: true })
  gte?: Date | string

  @Field(() => DateTimeFilter, { nullable: true })
  not?: DateTimeFilter
}

@InputType()
export class IntFilter {
  @Field(() => Int, { nullable: true })
  equals?: number;

  @Field(() => [Int], { nullable: true })
  in?: Array<number>

  @Field(() => [Int], { nullable: true })
  notIn?: Array<number>

  @Field(() => Int, { nullable: true })
  lt?: number

  @Field(() => Int, { nullable: true })
  lte?: number

  @Field(() => Int, { nullable: true })
  gt?: number

  @Field(() => Int, { nullable: true })
  gte?: number

  @Field(() => IntFilter, { nullable: true })
  not?: IntFilter
}
