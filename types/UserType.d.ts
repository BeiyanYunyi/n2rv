export default interface UserType {
  id: string;
  username: string;
  nickname: string | null;
  password: string;
  avatar: string | null;
  lastRevokeTime: string | number;
  isVerified: boolean;
}
