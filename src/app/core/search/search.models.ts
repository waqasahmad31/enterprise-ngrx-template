export type SearchResultType =
  | 'route'
  | 'user'
  | 'report'
  | 'audit'
  | 'team'
  | 'role'
  | 'billing'
  | 'integration'
  | 'support';

export type MaterialIconName = string;

export interface SearchResult {
  id: string;
  type: SearchResultType;
  label: string;
  description?: string;
  icon?: MaterialIconName;
  route?: string;
}
