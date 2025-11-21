'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryList } from '@/components/HistoryList';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
  useAuth,
  initiateAnonymousSignIn,
} from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Calculation } from '@/lib/types';
import { LoaderCircle } from 'lucide-react';

export default function HistoryPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      // If not loading and no user, initiate anonymous sign-in
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const calculationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'calculations'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: calculations, isLoading } =
    useCollection<Calculation>(calculationsQuery);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline tracking-wider text-primary">
          Your Past Sparks
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          A look back at your compatibility calculations.
        </p>
      </div>
      <HistoryList
        calculations={calculations ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
