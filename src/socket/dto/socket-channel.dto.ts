import { IsCuid } from '@/lib/decorators/is-cuid.decorator'

export class SocketChannelInput {
  @IsCuid()
  id: string
}
