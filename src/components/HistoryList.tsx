"use client";

import type { Calculation } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Heart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function HistoryList({ calculations, isLoading }: { calculations: Calculation[], isLoading: boolean }) {
  if (isLoading) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto !mt-3" />
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                        <Skeleton className="h-12 w-24 mx-auto" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
  }
  
  if (calculations.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-headline text-accent">No History Yet!</h2>
        <p className="mt-2 text-foreground/70">Go back to the homepage to calculate your first spark!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {calculations.map((calc) => (
        <Card key={calc.id} className="flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center justify-center gap-4">
              <span>{calc.name1}</span>
              <Heart className="size-5 fill-primary text-primary" />
              <span>{calc.name2}</span>
            </CardTitle>
            <CardDescription className="text-center !mt-2">
              {calc.createdAt ? format(calc.createdAt.toDate(), 'MMMM d, yyyy') : 'Date unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
             <div className="text-5xl font-headline text-accent">{calc.percentage}%</div>
             <p className="text-base font-body text-foreground/80">{calc.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
