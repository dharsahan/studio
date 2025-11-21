'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Heart, History, LogIn, LogOut } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="size-6 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-2xl font-headline tracking-wide text-primary">
            LoveSpark Calculator
          </h1>
        </Link>
        <nav className="flex items-center gap-2">
          {isUserLoading ? (
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/history">
                  <History className="mr-2" />
                  History
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">
                  <LogIn className="mr-2" />
                  Login
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
