import Module from '../../modules/Module';

export default interface ServerError extends Error {
  code: string
  message: string
  module: Module
  stack?: string
}
