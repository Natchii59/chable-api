import { Test, TestingModule } from '@nestjs/testing'

import { ChannelsMutationsResolver } from '../channels-mutations.resolver'

describe('ChannelsResolver', () => {
  let resolver: ChannelsMutationsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsMutationsResolver]
    }).compile()

    resolver = module.get<ChannelsMutationsResolver>(ChannelsMutationsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
