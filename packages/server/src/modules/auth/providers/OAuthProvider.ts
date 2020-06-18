export interface OAuthProvider {
  // Get the Redirect URI to the provider's authentication page.
  redirectUri: string

  // Get the `User` instance for the authenticated user.
  // user(): Promise<User>
}
