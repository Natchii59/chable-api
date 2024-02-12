import { ChannelType } from '@prisma/client'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'

@ValidatorConstraint({ name: 'createChannelName', async: false })
export class CreateChannelName implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    const type = args.object['type'] as ChannelType

    switch (type) {
      case ChannelType.PUBLIC:
        return name && name.length >= 3
      case ChannelType.GROUP:
        return !(name !== undefined && name !== null && name.length < 3)
      case ChannelType.PRIVATE:
        return name === undefined || name === null
    }
  }

  defaultMessage(args: ValidationArguments) {
    const type = args.object['type'] as ChannelType
    switch (type) {
      case ChannelType.PUBLIC:
        return 'Name is required and must be at least 3 characters long'
      case ChannelType.GROUP:
        return 'Name must be at least 3 characters long'
      case ChannelType.PRIVATE:
        return 'Name is required only for public channels'
    }
  }
}

@ValidatorConstraint({ name: 'createChannelUserIds', async: false })
export class CreateChannelUserIds implements ValidatorConstraintInterface {
  validate(userIds: string[], args: ValidationArguments) {
    const type = args.object['type'] as ChannelType

    switch (type) {
      case ChannelType.PUBLIC:
        return !userIds || !userIds.length
      case ChannelType.GROUP:
        return userIds && userIds.length > 1
      case ChannelType.PRIVATE:
        return userIds && userIds.length === 1
    }
  }

  defaultMessage(args: ValidationArguments) {
    const type = args.object['type'] as ChannelType
    switch (type) {
      case ChannelType.PUBLIC:
        return 'User IDs are not allowed for public channels'
      case ChannelType.GROUP:
        return 'Group channels must have at least 2 users'
      case ChannelType.PRIVATE:
        return 'Private channels must have exactly 2 users'
    }
  }
}
