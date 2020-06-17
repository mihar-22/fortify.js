export enum Framework {
  Azure = 'azure',
  Google = 'google',
  AWS = 'aws',
  Netlify = 'netlify',
  Vercel = 'vercel',
  Express = 'express',
  Koa = 'koa',
  Hapi = 'hapi',
  Middy = 'middy',
  Nextjs = 'nextjs',
  Nuxtjs = 'nuxtjs'
}

export interface HttpConfig {
  framework: Framework
}
