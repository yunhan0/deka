import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBlockLabel, getBlockStatus } from "@/lib/blocks";

export function BlockCard({
  blockNumber,
  year,
}: {
  blockNumber: number;
  year: number;
}) {
  const status = getBlockStatus(blockNumber, year);
  const label = getBlockLabel(blockNumber, year);
  const position = (blockNumber - 1) % 3;

  return (
    <Link
      href={`/block/${blockNumber}?year=${year}`}
      className={cn(
        "group relative flex flex-col rounded-lg border p-3 transition-all hover:shadow-md",
        status === "current" &&
          "ring-2 ring-primary border-primary bg-primary/5",
        status === "past" && "bg-muted/30 text-muted-foreground",
        status === "future" && "bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium",
            status === "current" ? "text-primary" : "text-muted-foreground"
          )}
        >
          {position === 0 ? "Early" : position === 1 ? "Mid" : "Late"}
        </span>
        <span
          className={cn(
            "text-xs tabular-nums",
            status === "current"
              ? "font-semibold text-primary"
              : "text-muted-foreground"
          )}
        >
          #{blockNumber}
        </span>
      </div>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </Link>
  );
}
