import { TierLevel } from './tiers';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userTier: TierLevel;
  restaurantId: string;
  restaurantName: string;
  restaurantLocation: string;
  image: string;
  rating: number;
  review: string;
  pointsEarned: number;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export const POSTS: Post[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    userTier: 'gold',
    restaurantId: '1',
    restaurantName: 'Osteria Mozza',
    restaurantLocation: 'Hollywood',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    rating: 8,
    review: 'Absolutely divine! The burrata was perfectly creamy and the pasta was cooked to perfection. Best Italian in LA hands down.',
    pointsEarned: 25,
    timestamp: '2h ago',
    likes: 142,
    isLiked: true,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Marcus Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    userTier: 'platinum',
    restaurantId: '2',
    restaurantName: 'Sushi Gen',
    restaurantLocation: 'Little Tokyo',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
    rating: 7,
    review: 'Fresh sashimi and great atmosphere. The omakase was incredible. Will definitely be back!',
    pointsEarned: 30,
    timestamp: '5h ago',
    likes: 89,
    isLiked: false,
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Emma Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    userTier: 'silver',
    restaurantId: '4',
    restaurantName: 'Republique',
    restaurantLocation: 'Mid-City',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    rating: 8,
    review: 'The pastries here are out of this world! Got the croissants and pain au chocolat. Worth every penny.',
    pointsEarned: 20,
    timestamp: '1d ago',
    likes: 234,
    isLiked: true,
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Alex Kim',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    userTier: 'diamond',
    restaurantId: '5',
    restaurantName: 'Howlin Rays',
    restaurantLocation: 'Chinatown',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
    rating: 7,
    review: 'Best Nashville hot chicken in LA! The wait was worth it. Medium spice level was perfect for me.',
    pointsEarned: 15,
    timestamp: '1d ago',
    likes: 156,
    isLiked: false,
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Olivia Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    userTier: 'gold',
    restaurantId: '6',
    restaurantName: 'Providence',
    restaurantLocation: 'Hollywood',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80',
    rating: 8,
    review: 'Exceptional seafood experience. The tasting menu was perfectly paced and every dish was a work of art.',
    pointsEarned: 40,
    timestamp: '2d ago',
    likes: 198,
    isLiked: true,
  },
  {
    id: '6',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    userTier: 'gold',
    restaurantId: '3',
    restaurantName: 'Guelaguetza',
    restaurantLocation: 'Koreatown',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    rating: 7,
    review: 'Authentic Oaxacan cuisine! The mole negro was rich and complex. Great portions and reasonable prices.',
    pointsEarned: 20,
    timestamp: '3d ago',
    likes: 87,
    isLiked: false,
  },
];

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userTier: TierLevel;
  rating: number;
  review: string;
  timestamp: string;
  images: string[];
  likes: number;
  isLiked: boolean;
}

export function getRestaurantReviews(restaurantId: string): Review[] {
  return POSTS
    .filter(post => post.restaurantId === restaurantId)
    .map(post => ({
      id: post.id,
      userId: post.userId,
      userName: post.userName,
      userAvatar: post.userAvatar,
      userTier: post.userTier,
      rating: post.rating,
      review: post.review,
      timestamp: post.timestamp,
      images: [post.image],
      likes: post.likes,
      isLiked: post.isLiked,
    }));
}
