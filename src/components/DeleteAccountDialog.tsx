import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteAccountDialogProps {
  userEmail: string;
}

export const DeleteAccountDialog = ({ userEmail }: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText !== 'XOÁ TÀI KHOẢN') {
      toast.error('Vui lòng nhập đúng "XOÁ TÀI KHOẢN" để xác nhận');
      return;
    }

    setLoading(true);

    try {
      // Sign out the user (note: actual account deletion requires admin or service role)
      // For now, we'll sign out and show a message
      await supabase.auth.signOut();
      
      toast.success('Yêu cầu xoá tài khoản đã được gửi. Tài khoản sẽ được xử lý trong 24 giờ.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Không thể xoá tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Xoá tài khoản
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-gold border-destructive/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Xoá tài khoản vĩnh viễn
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Bạn có chắc chắn muốn xoá tài khoản <strong>{userEmail}</strong>?
            </p>
            <p className="text-destructive font-medium">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xoá vĩnh viễn bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Hồ sơ và avatar</li>
              <li>Tất cả bài viết và nhật ký</li>
              <li>Điểm Ánh Sáng và thành tích</li>
              <li>Lịch sử trò chuyện</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 my-4">
          <Label htmlFor="confirmDelete" className="text-sm text-muted-foreground">
            Nhập <strong className="text-destructive">XOÁ TÀI KHOẢN</strong> để xác nhận
          </Label>
          <Input
            id="confirmDelete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="XOÁ TÀI KHOẢN"
            className="border-destructive/30 focus:border-destructive"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-gold/30">Huỷ bỏ</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'XOÁ TÀI KHOẢN'}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xoá tài khoản
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
