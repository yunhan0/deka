import { BLOCKS_PER_YEAR, getBlockMonth } from "@/lib/blocks";
import { BlockCard } from "@/components/block-card";

export function BlockGrid({ year }: { year: number }) {
  const blocks = Array.from({ length: BLOCKS_PER_YEAR }, (_, i) => i + 1);

  // Group into rows of 3 (one row per month)
  const months: number[][] = [];
  for (let i = 0; i < blocks.length; i += 3) {
    months.push(blocks.slice(i, i + 3));
  }

  return (
    <div className="space-y-2">
      {months.map((monthBlocks, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">
            {getBlockMonth(monthBlocks[0]).slice(0, 3)}
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {monthBlocks.map((blockNumber) => (
              <BlockCard
                key={blockNumber}
                blockNumber={blockNumber}
                year={year}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
