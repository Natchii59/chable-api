import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccessGuard, Actions, UseAbility } from 'nest-casl'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import {
  FindManyChannelsArgs,
  FindManyChannelsObject,
  FindUniqueChannelArgs
} from '@/channels/dto/channels-queries.dto'
import { Channel } from '@/channels/models/channel.model'
import { ChannelHook } from '@/channels/permissions/channels.hooks'

import { JwtPayload } from 'types/auth'

@Resolver()
export class ChannelsQueriesResolver {
  constructor(private channelsService: ChannelsService) {}

  @Query(() => Channel, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Channel, ChannelHook)
  getChannel(@Args() args: FindUniqueChannelArgs) {
    return this.channelsService.getChannel(args.id)
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
