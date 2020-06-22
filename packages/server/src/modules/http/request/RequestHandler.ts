import { IncomingMessage, ServerResponse } from 'http';
import { FortifyRequest, FortifyResponse } from './Request';

export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type FortifyRequestHandler<ReqBodyType = any, ResBodyType = any> = (
  req: FortifyRequest<ReqBodyType>,
  res: FortifyResponse<ResBodyType>
) => Promise<void>;
