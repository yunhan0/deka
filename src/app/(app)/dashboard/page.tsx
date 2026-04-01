import { BlockGrid } from "@/components/block-grid";
import { getCurrentBlock } from "@/lib/blocks";
import Link from "next/link";
import { cn } from "@/lib/utils";

const linkBtn = "inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-7 text-sm font-medium hover:bg-muted transition-colors";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const current = getCurrentBlock();
  const year = params.year ? parseInt(params.year, 10) : current.year;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{year}</h2>
        <div className="flex gap-1">
          <Link href={`/dashboard?year=${year - 1}`} className={linkBtn}>
            &larr;
          </Link>
          {year !== current.year && (
            <Link href="/dashboard" className={linkBtn}>
              Today
            </Link>
          )}
          <Link href={`/dashboard?year=${year + 1}`} className={linkBtn}>
            &rarr;
          </Link>
        </div>
      </div>
      <BlockGrid year={year} />
    </div>
  );
}
