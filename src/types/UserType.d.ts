export default interface UserType {
  id: string;
  username: string;
  nickname: string | null;
  password: string;
  avatar: Blob | null;
  lastRevokeTime: string | number;
}
