export type TierLevel = 'foodie' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'elite' | 'legend';

export interface Tier {
  id: TierLevel;
  name: string;
  minPoints: number;
  color: string;
  gradient: [string, string];
  icon: string;
  benefits: string[];
}

export const TIERS: Record<TierLevel, Tier> = {
  foodie: {
    id: 'foodie',
    name: 'Foodie',
    minPoints: 0,
    color: '#9E9E9E',
    gradient: ['#BDBDBD', '#9E9E9E'],
    icon: '🍽️',
    benefits: ['Earn points on every visit', 'Share reviews'],
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 150,
    color: '#CD7F32',
    gradient: ['#E6A85C', '#CD7F32'],
    icon: '🥉',
    benefits: ['5% off at partner restaurants', 'Priority reservations'],
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    minPoints: 300,
    color: '#C0C0C0',
    gradient: ['#E8E8E8', '#C0C0C0'],
    icon: '🥈',
    benefits: ['10% off at partner restaurants', 'Free appetizer monthly'],
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    minPoints: 450,
    color: '#FFD700',
    gradient: ['#FFE55C', '#FFD700'],
    icon: '🥇',
    benefits: ['15% off at partner restaurants', 'Free dessert weekly', 'VIP events access'],
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 600,
    color: '#E5E4E2',
    gradient: ['#F5F5F5', '#E5E4E2'],
    icon: '💎',
    benefits: ['20% off at all restaurants', 'Complimentary drinks', 'Chef table access'],
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    minPoints: 750,
    color: '#B9F2FF',
    gradient: ['#E0F7FF', '#B9F2FF'],
    icon: '💠',
    benefits: ['25% off everywhere', 'Free meal monthly', 'Private dining events'],
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    minPoints: 900,
    color: '#9C27B0',
    gradient: ['#BA68C8', '#9C27B0'],
    icon: '👑',
    benefits: ['30% off everywhere', 'Concierge service', 'Exclusive menu items'],
  },
  legend: {
    id: 'legend',
    name: 'Legend',
    minPoints: 1050,
    color: '#FF6B35',
    gradient: ['#FF8A5B', '#FF6B35'],
    icon: '⭐',
    benefits: ['40% off everywhere', 'Personal chef consultations', 'Lifetime VIP status'],
  },
};

export function getTierByPoints(points: number): Tier {
  const tierLevels: TierLevel[] = ['legend', 'elite', 'diamond', 'platinum', 'gold', 'silver', 'bronze', 'foodie'];
  
  for (const level of tierLevels) {
    if (points >= TIERS[level].minPoints) {
      return TIERS[level];
    }
  }
  
  return TIERS.foodie;
}

export function getNextTier(currentTier: TierLevel): Tier | null {
  const tierLevels: TierLevel[] = ['foodie', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'elite', 'legend'];
  const currentIndex = tierLevels.indexOf(currentTier);
  
  if (currentIndex < tierLevels.length - 1) {
    return TIERS[tierLevels[currentIndex + 1]];
  }
  
  return null;
}
