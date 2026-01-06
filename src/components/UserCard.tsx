import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FollowButton } from './FollowButton';
import { useLanguage } from '@/hooks/useLanguage';
import { User } from 'lucide-react';

interface UserCardProps {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  lightScore?: number;
  followersCount?: number;
  showFollowButton?: boolean;
}

export const UserCard = ({
  userId,
  displayName,
  avatarUrl,
  lightScore,
  followersCount,
  showFollowButton = true
}: UserCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-card rounded-xl p-4 border hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Link to={`/user/${userId}`}>
          <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/user/${userId}`}>
            <h3 className="font-semibold truncate hover:text-primary transition-colors">
              {displayName || t('profile.anonymous')}
            </h3>
          </Link>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {lightScore !== undefined && (
              <span className="flex items-center gap-1">
                ✨ {lightScore}
              </span>
            )}
            {followersCount !== undefined && (
              <span>
                {followersCount} {t('profile.followers')}
              </span>
            )}
          </div>
        </div>

        {showFollowButton && (
          <FollowButton targetUserId={userId} size="sm" />
        )}
      </div>
    </motion.div>
  );
};
