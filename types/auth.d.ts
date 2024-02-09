export interface JwtPayload {
  userId: string
  refreshTokenId: string
}

export type JwtValidatePayload<T> = T & {
  iat: number
  exp: number
}
