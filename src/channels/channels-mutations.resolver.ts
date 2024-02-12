import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import { CreateChannelArgs } from '@/channels/dto/channels-mutations.dto'
import { Channel } from '@/channels/models/channel.model'

import { JwtPayload } from 'types/auth'

@Resolver()
export class ChannelsMutationsResolver {
  constructor(private channelsService: ChannelsService) {}

  @Mutation(() => Channel, { nullable: true })
  createChannel(
    @Args() args: CreateChannelArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    return this.channelsService.createChannel(args.data, payload.userId)
  }
}
