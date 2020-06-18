/* eslint-disable no-shadow */

import { Nextjs, NextjsRouteHandler } from './adapters/Nextjs';
import { AdapterConstructor } from './Adapter';

export enum Framework {
  // Node = 'node',
  Nextjs = 'nextjs',
  // Vercel = 'vercel',
  // Azure = 'azure',
  // Google = 'google',
  // AWS = 'aws',
  // Nuxtjs = 'nuxtjs',
  // Netlify = 'netlify',
}

export interface FrameworkRouteHandler {
  [Framework.Nextjs]: NextjsRouteHandler
}

export type FrameworkAdapterRecord = {
  [P in keyof FrameworkRouteHandler]: AdapterConstructor<FrameworkRouteHandler[P]>
};

export const FrameworkAdapter: FrameworkAdapterRecord = {
  [Framework.Nextjs]: Nextjs,
};
