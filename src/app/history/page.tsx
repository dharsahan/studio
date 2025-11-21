"use client";

import { useMemo } from "react";
import { HistoryList } from "@/components/HistoryList";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Calculation } from "@/lib/types";

export default function HistoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const calculationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "calculations"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: calculations, isLoading } = useCollection<Calculation>(
    calculationsQuery
  );

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
        isLoading={isLoading || isUserLoading}
      />
    </div>
  );
}
