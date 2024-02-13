import { join } from 'path'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { CaslModule } from 'nest-casl'

import { JwtAuthGuard } from '@/auth/guards/jwt.guard'
import { JwtMiddleware } from '@/auth/middlewares/jwt.middleware'
import { DataloaderService } from '@/dataloader/dataloader.service'
import { SocketModule } from '@/socket/socket.module'
import { AuthModule } from './auth/auth.module'
import { ChannelsModule } from './channels/channels.module'
import { DatabaseModule } from './database/database.module'
import { DataloaderModule } from './dataloader/dataloader.module'
import { UploadsModule } from './uploads/uploads.module'
import { UsersModule } from './users/users.module'

import { JwtPayload } from 'types/auth'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloader: DataloaderService) => ({
        csrfPrevention: false,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: 'src/graphql/schema.gql',
        sortSchema: true,
        context: ({ req, res }) => ({
          req,
          res,
          loaders: dataloader.getLoaders()
        }),
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
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/cdn'
    }),
    CaslModule.forRoot({
      getUserFromRequest: req => {
        const payload = req.user as unknown as JwtPayload
        return {
          id: payload.userId,
          roles: null
        }
      }
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    UploadsModule,
    SocketModule,
    ChannelsModule
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
