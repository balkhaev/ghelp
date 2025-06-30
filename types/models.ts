export interface Build {
  id?: number;
  talents: Record<string, string>;
  branch: Record<string, string>;
  shard: string | null;
  crit_importance: string | null;
  power: string | number | null;
}

export interface Hero {
  id?: number;
  name: string;
  image: string | null;
  builds?: Build[];
} 