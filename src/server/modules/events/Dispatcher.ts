export interface EventsConfig {
  // ...
}

export interface Dispatcher {
  listen<T>(event: string, cb: (payload?: T) => void): () => void
  dispatch(event: string, payload?: any): void
  push(event: string, payload?: any): void
  flush(event: string): void
  forgetPushed(): void
}
