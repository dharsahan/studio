import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, History } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="size-6 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-2xl font-headline tracking-wide text-primary">
            LoveSpark Calculator
          </h1>
        </Link>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/history">
              <History className="mr-2" />
              History
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
