export interface Log<T, M> {
  module: M,
  event?: T
  message: string
  context: object
}

export type LogBuilder<T, M> = (...args: any[]) => Log<T, M>;

export type Logs<T extends keyof any, M extends keyof any> = Record<T, LogBuilder<T, M>>;
