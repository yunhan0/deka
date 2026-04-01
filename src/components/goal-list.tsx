import { GoalCard } from "@/components/goal-card";
import type { Category, Goal } from "@/types";

export function GoalList({
  goals,
  categories,
  profileId,
  year,
  blockNumber,
}: {
  goals: { goal: Goal; category: Category }[];
  categories: Category[];
  profileId: string;
  year: number;
  blockNumber: number;
}) {
  if (goals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No goals for this block yet. Add one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {goals.map(({ goal, category }) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          category={category}
          categories={categories}
          profileId={profileId}
          year={year}
          blockNumber={blockNumber}
        />
      ))}
    </div>
  );
}
