import { CookieSameSite } from '../cookies/Cookie';

// @TODO: Not sure about this config yet...
export interface SessionConfig {
  path?: string
  domain?: string
  secure?: boolean
  lifetime?: number
  sameSite?: CookieSameSite
  httpOnly?: boolean
}
