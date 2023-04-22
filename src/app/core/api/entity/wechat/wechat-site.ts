import { WechatAccount } from './wechat-account';

export interface WechatSite {
  id?: number;
  domain: string;
  wechatAccount: WechatAccount;
}
