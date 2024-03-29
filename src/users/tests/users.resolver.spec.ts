import { Test, TestingModule } from '@nestjs/testing'

import { UsersQueriesResolver } from '../users-queries.resolver'

describe('UsersResolver', () => {
  let resolver: UsersQueriesResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersQueriesResolver]
    }).compile()

    resolver = module.get<UsersQueriesResolver>(UsersQueriesResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
