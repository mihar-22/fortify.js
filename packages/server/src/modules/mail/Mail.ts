import { PayloadType } from '../events/Dispatcher';

export interface MailResponse {
  success: boolean
}

export interface Mail<T> {
  to: string,
  subject: string,
  text?: string
  template?: string
  data?: PayloadType<T>
}
