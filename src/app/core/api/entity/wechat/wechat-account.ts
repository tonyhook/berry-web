import { WechatSite } from './wechat-site';

export interface WechatAccount {
  id?: number;
  type?: string;
  name?: string;
  wechatid?: string;
  originalid?: string;
  email?: string;
  password?: string;
  appid?: string;
  secret?: string;
  messageToken?: string;
  verifyFilename?: string;
  verifyContent?: string;
  authDomain?: string;
  wechatSites?: WechatSite[];
}
