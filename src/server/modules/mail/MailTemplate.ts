import { join } from 'path';

export enum MailTemplate {
  VerifyEmail = 'verifyEmail',
  ResetPassword = 'resetPassword'
}

export const MailTemplatePath = {
  [MailTemplate.VerifyEmail]: join(__dirname, 'templates/verify-email.html'),
  [MailTemplate.ResetPassword]: join(__dirname, 'templates/reset-password.html'),
};

export default class MailTemplateBuilder {
}
