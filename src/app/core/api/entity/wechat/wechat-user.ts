export interface WechatUser {
  openid: string;
  scope: string;
  avatar: string | null;
  gender: number | null;
  nickname: string | null;
  subscribed: boolean | null;
  unionid: string | null;
}
