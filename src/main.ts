import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-minimal'

import { formatErrorMessages } from '@/lib/format'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        const messages = formatErrorMessages(errors)
        return new BadRequestException(messages)
      },
      transform: true
    })
  )

  app.use(graphqlUploadExpress({ maxFileSize: 10000000 })) // 10 MB limit

  app.use(cookieParser())

  await app.listen(process.env.PORT)
}
bootstrap()
