import { Args, Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import {
  FindManyChannelsArgs,
  FindManyChannelsObject,
  GetChannelArgs
} from '@/channels/dto/channels-queries.dto'
import { Channel } from '@/channels/models/channel.model'

import { JwtPayload } from 'types/auth'

@Resolver()
export class ChannelsQueriesResolver {
  constructor(private channelsService: ChannelsService) {}

  @Query(() => Channel, { nullable: true })
  getChannel(@Args() args: GetChannelArgs, @CurrentUser() payload: JwtPayload) {
    return this.channelsService.getChannel(args.id, payload.userId)
  }

  @Query(() => FindManyChannelsObject, { nullable: true })
  async getChannels(
    @Args() args: FindManyChannelsArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    const channels = await this.channelsService.getChannels(
      args,
      payload.userId
    )

    return { channels }
  }
}
