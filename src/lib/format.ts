import type { ValidationError } from 'class-validator'

import type { GraphQLErrorMessage } from 'types/graphql'

export function formatErrorMessages(
  errors: ValidationError[],
  messages: GraphQLErrorMessage[] = []
): GraphQLErrorMessage[] {
  errors.forEach(error => {
    if (error.children.length > 0) {
      return formatErrorMessages(error.children, messages)
    } else {
      const msg = Object.values(error.constraints)[0]
      messages.push({ field: error.property, message: msg })
    }
  })

  return messages
}
