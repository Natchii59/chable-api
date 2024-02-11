import { Type } from '@nestjs/common'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'

export function IsMatchWith<T, K extends keyof T>(
  _classRef: Type<T>,
  property?: readonly K[],
  validationOpt?: ValidationOptions
) {
  return (obj: any, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options: validationOpt,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          return !(value !== (args.object as any)[args.constraints[0]])
        },

        defaultMessage({ property, constraints }: ValidationArguments): string {
          return `${property} must match ${constraints[0]}`
        }
      }
    })
  }
}
