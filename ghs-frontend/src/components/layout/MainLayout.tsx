import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">GHS</h1>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}

export default MainLayout;