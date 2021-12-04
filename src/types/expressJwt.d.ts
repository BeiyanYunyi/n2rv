declare global {
  namespace Express {
    interface User {
      username: string;
      id: string;
    }

    interface Request {
      user: User;
    }
  }
}
