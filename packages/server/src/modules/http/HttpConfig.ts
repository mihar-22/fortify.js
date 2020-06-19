import { CorsOptions } from 'cors';
import { RateLimiterAbstract } from 'rate-limiter-flexible';

export interface HttpConfig {
  // @see https://expressjs.com/en/resources/middleware/cors.html
  cors?: CorsOptions
  // @see https://www.npmjs.com/package/rate-limiter-flexible
  rateLimiter?: RateLimiterAbstract
  // @see http://expressjs.com/en/guide/behind-proxies.html
  trustedProxies?: boolean
  | number
  | string
  | string[]
  | ((ip: string, distanceFromSocket: number) => boolean)
}
