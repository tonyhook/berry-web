import { Agreement } from './agreement';

export interface Visitor {
  openid: string;
  createTime?: string;
  name: string;
  addressCode: string;
  phone: string;
  enabled: boolean;
  agreements: Agreement[];
}
