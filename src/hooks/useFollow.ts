import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useFollow = (user: User | null, targetUserId?: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowing = async () => {
      if (!user || !targetUserId || user.id === targetUserId) return;

      try {
        const { data } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .single();

        setIsFollowing(!!data);
      } catch (error) {
        // Not following
        setIsFollowing(false);
      }
    };

    checkFollowing();
  }, [user, targetUserId]);

  const toggleFollow = useCallback(async () => {
    if (!user || !targetUserId || user.id === targetUserId) return;

    setLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        setIsFollowing(false);
        toast({
          title: 'Đã hủy theo dõi',
          description: 'Bạn đã hủy theo dõi người dùng này'
        });
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        setIsFollowing(true);
        toast({
          title: 'Đã theo dõi',
          description: 'Bạn đã theo dõi người dùng này'
        });

        // Create notification for the followed user
        await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            type: 'follow',
            title: 'Người theo dõi mới',
            message: 'Có người vừa theo dõi bạn!',
            data: { follower_id: user.id }
          });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thực hiện hành động này',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, targetUserId, isFollowing, toast]);

  return {
    isFollowing,
    loading,
    toggleFollow
  };
};
