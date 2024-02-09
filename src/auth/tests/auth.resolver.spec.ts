import { Test, TestingModule } from '@nestjs/testing'

import { AuthMutationsResolver } from '../auth-mutations.resolver'

describe('AuthResolver', () => {
  let resolver: AuthMutationsResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMutationsResolver]
    }).compile()

    resolver = module.get<AuthMutationsResolver>(AuthMutationsResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
