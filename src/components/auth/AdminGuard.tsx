import { useAppStore } from '@/store/useAppStore';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

export function AdminGuard() {
  const user = useAppStore(state => state.user);
  const isLoading = useAppStore(state => state.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-dark-luxury">
        <Loader2 className="w-10 h-10 animate-spin text-temple-red" />
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return <AdminLoginPage />;
  }

  return <AdminLayout />;
}

