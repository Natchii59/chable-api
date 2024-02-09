import { compare, genSalt, hash } from 'bcrypt'

export async function hashString(input: string) {
  const SALT = await genSalt()
  return await hash(input, SALT)
}

export async function compareHash(input: string, hash: string) {
  return await compare(input, hash)
}
