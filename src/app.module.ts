import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'

import { JwtAuthGuard } from '@/auth/guards/jwt.guard'
import { JwtMiddleware } from '@/auth/middlewares/jwt.middleware'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: 'src/graphql/schema.gql',
      sortSchema: true,
      fieldResolverEnhancers: ['guards'],
      context: ({ req, res }) => ({ req, res }),
      formatError: err => {
        const { originalError } = err.extensions as any

        if (originalError) {
          return {
            ...originalError,
            path: err.path
          }
        }

        return err
      }
    }),
    DatabaseModule,
    UsersModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST
    })
  }
}
