import { join } from 'path';

export enum AuthMailTemplate {
  VerifyEmail = 'verifyEmail',
  ResetPassword = 'resetPassword'
}

export type AuthMailTemplates = { [T in AuthMailTemplate]?: string };

export const AuthMailTemplatePath = {
  [AuthMailTemplate.VerifyEmail]: join(__dirname, 'templates/verify-email.html'),
  [AuthMailTemplate.ResetPassword]: join(__dirname, 'templates/reset-password.html'),
};
