export interface User {
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  user: User;
  token: string;
}
