export interface MenuTreeNode {
  name: string;
  sequence: number;
  icon?: string | null;
  link?: string | null;
  disabled: boolean;
  children?: MenuTreeNode[] | null;
}
