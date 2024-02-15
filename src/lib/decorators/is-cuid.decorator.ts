import { isCuid } from '@paralleldrive/cuid2'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'

export function IsCuid(validationOpt?: ValidationOptions) {
  return (obj: object, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options: validationOpt,
      validator: {
        validate(value: string) {
          return value && value.length >= 24 && isCuid(value)
        },

        defaultMessage({ property }: ValidationArguments): string {
          return `${property} must be a valid cuid`
        }
      }
    })
  }
}
