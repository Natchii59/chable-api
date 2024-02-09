export interface UserPayload {
  id: string
}

export interface JwtValidatePayload extends UserPayload {
  iat: number
  exp: number
}
