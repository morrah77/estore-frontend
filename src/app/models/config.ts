export interface Config {
  appName: string;
  apiUrl: string;
  staticPagesUrl: string;
  auth: {
    google: {
      clientId: string;
      scopes: string;
    }
  },
  payments: {
    stripe: {
      apiKey: string
    }
  }
}
