import { HistoryList } from "@/components/HistoryList";
import { getHistoryAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const calculations = await getHistoryAction();

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
      <HistoryList calculations={calculations} />
    </div>
  );
}
