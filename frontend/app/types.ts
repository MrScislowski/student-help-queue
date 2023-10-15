export interface User {
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  user: User;
  selectedClass: {
    name: string;
    teacherEmail: string;
  };
}
