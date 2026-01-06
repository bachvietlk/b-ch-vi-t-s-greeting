import { motion } from 'framer-motion';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  targetUserId: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const FollowButton = ({ targetUserId, size = 'default', className }: FollowButtonProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isFollowing, loading, toggleFollow } = useFollow(user, targetUserId);

  // Don't show button if not logged in or viewing own profile
  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size={size}
      onClick={toggleFollow}
      disabled={loading}
      className={cn(
        'transition-all duration-300',
        isFollowing && 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          {t('follow.unfollow')}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          {t('follow.follow')}
        </>
      )}
    </Button>
  );
};
