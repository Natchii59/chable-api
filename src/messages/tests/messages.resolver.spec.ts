import { Test, TestingModule } from '@nestjs/testing'

import { MessagesMutationsResolver } from '../messages-mutations.resolver'

describe('MessagesResolver', () => {
  let resolver: MessagesMutationsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesMutationsResolver]
    }).compile()

    resolver = module.get<MessagesMutationsResolver>(MessagesMutationsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
