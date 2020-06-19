import { HttpMethod } from '../request/Request';
import { FortifyRequestHandler } from '../request/RequestHandler';

export interface Route<ReqBodyType = any, ResBodyType = any> {
  path: string
  method: HttpMethod
  handler: FortifyRequestHandler<ReqBodyType, ResBodyType>
}
