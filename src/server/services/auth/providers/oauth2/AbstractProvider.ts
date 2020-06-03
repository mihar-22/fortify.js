// import { nanoid } from 'nanoid';
// import fetch from 'node-fetch';
// import { addQueryParamsToUrl, Params } from '../../../../../utils/url';
// import { Request } from '../../../routing/Request';
// import { OAuthProvider } from '../OAuthProvider';
// import User, { RawUserData } from '../../../../../shared/User';
//
// export default abstract class AbstractProvider implements OAuthProvider {
//   public redirectUri: string;
//
//   protected request: Request;
//
//   protected httpClient = fetch;
//
//   protected clientId: string;
//
//   protected clientSecret: string;
//
//   // The custom parameters to be sent with the request.
//   protected parameters: Params = {};
//
//   // The scopes being requested.
//   protected scopes: string[] = [];
//
//   // The separating character for the requested scopes.
//   protected scopeSeparator = ',';
//
//   // Indicates if the session state should be utilized.
//   protected stateless = false;
//
//   protected constructor(
//     request: Request,
//     clientId: string,
//     clientSecret: string,
//     redirectUri: string,
//   ) {
//     this.request = request;
//     this.clientId = clientId;
//     this.clientSecret = clientSecret;
//     this.redirectUri = redirectUri;
//   }
//
//   // Get the authentication URL for the provider.
//   protected abstract getAuthUrl(state?: string): string;
//
//   // Get the access token URL for the provider.
//   protected abstract getAccessTokenUrl(): string;
//
//   // Get the raw user for the given access token.
//   protected abstract getUserByAccessToken(token: string): RawUserData;
//
//   // Map the raw user data to a `User` object.
//   protected abstract mapRawUser(raw: RawUserData): User;
//
//   // Redirect the user of the application to the provider's authentication screen.
//   public getRedirectUrl() {
//     let state;
//
//     if (!this.stateless) {
//       state = nanoid(48);
//       this.request.session.put('state', state);
//     }
//
//     return this.getAuthUrl(state);
//   }
//
//   protected buildAuthUrlFromBase(url: string, state?: string) {
//     return addQueryParamsToUrl(url, this.getCodeFields(state));
//   }
//
//   protected getFormattedScopes() {
//     return this.scopes.join(this.scopeSeparator);
//   }
//
//   protected getCodeFields(state?: string) {
//     const fields: Record<string, undefined | string> = {
//       client_id: this.clientId,
//       redirect_uri: this.redirectUri,
//       scope: this.getFormattedScopes(),
//       response_type: 'code',
//     };
//
//     if (!this.stateless) {
//       fields.state = state;
//     }
//
//     return { ...fields, ...this.parameters };
//   }
//
//   protected getCode() {
//     return this.request.body.code;
//   }
//
//   public async user(): Promise<User> {
//     if (this.hasInvalidState()) {
//       throw Error('');
//     }
//
//     const response = await this.getAccessTokenResponse(this.getCode());
//     const accessToken = response.access_token;
//     const user = this.mapRawUser(this.getUserByAccessToken(accessToken));
//
//     user.tokens = {
//       accessToken,
//       refreshToken: response.refresh_token,
//       expiresIn: response.expires_in,
//     };
//
//     return user;
//   }
//
//   protected hasInvalidState() {
//     if (this.stateless) { return false; }
//     const state = this.request.session.pull('state');
//     return !(state && (state!.length > 0) && this.request.body.state === state);
//   }
//
//   public async getAccessTokenResponse(code: string) {
//     const res = await fetch(this.getAccessTokenUrl(), {
//       headers: { Accept: 'application/json' },
//       method: 'POST',
//       // @ts-ignore
//       body: new URLSearchParams(this.getAccessTokenParams(code)),
//     });
//     return res.json();
//   }
//
//   public getAccessTokenParams(code: string): Record<string, string> {
//     return {
//       client_id: this.clientId,
//       client_secret: this.clientSecret,
//       code,
//       redirect_uri: this.redirectUri,
//     };
//   }
// }
