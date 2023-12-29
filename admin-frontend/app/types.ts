
export interface User {
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface Teacher {
  _id: string;
  email: string;
  slug: string;
  classes: string[];
}