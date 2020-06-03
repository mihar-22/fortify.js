export interface SmtpConfig {
  host: string
  port: number
  username: string
  password: string
  encryption?: string
  fromName: string
  fromAddress: string
}

export class SmtpMailer {

}
