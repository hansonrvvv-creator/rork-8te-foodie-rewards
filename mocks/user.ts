import { TierLevel } from './tiers';

export interface User {
  id: string;
  name: string;
  avatar: string;
  tier: TierLevel;
  points: number;
  totalCheckins: number;
  totalReviews: number;
  memberSince: string;
}

export const CURRENT_USER: User = {
  id: 'current',
  name: 'You',
  avatar: 'https://i.pravatar.cc/150?img=68',
  tier: 'gold',
  points: 687,
  totalCheckins: 42,
  totalReviews: 38,
  memberSince: 'January 2024',
};
