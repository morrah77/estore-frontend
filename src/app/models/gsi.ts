// import * as gsi from "@types/gsi"; - however, this package oes not contain some types used in this application :(
export interface initCodeResponse {
  code: string;
  scope: string
}

export interface initCodeParams {
  client_id: string;
  scope: string;
  ux_mode: "popup" | "redirect";
  callback: (resp: initCodeResponse) => void;
}

export interface initTokenResponse {
  access_token: string;
  authuser: number | string;
  expires_in: number;
  prompt: string;
  scope: string;
    // example: "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
  token_type: string;
    // example: "Bearer"
}

export interface initTokenParams {
  client_id: string;
  scope: string;
  ux_mode?: "popup" | "redirect";
  callback: (resp: initTokenResponse) => void;
}

export interface accessTokenParams {
  prompt: string;
}

export interface TokenClient {
  requestAccessToken: (params?: accessTokenParams) => void
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initCodeClient: (arg0: initCodeParams) => any;
          initTokenClient: (arg0: initTokenParams) => any;
        };
      };
    };
  }
}
