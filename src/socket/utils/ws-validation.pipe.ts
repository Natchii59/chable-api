import { Injectable, ValidationPipe } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { ValidationError } from 'class-validator'

import { formatErrorMessages } from '@/lib/format'

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (errors: ValidationError[]) => {
      const message = formatErrorMessages(errors)
      return new WsException({
        type: 'validation',
        message
      })
    }
  }
}
