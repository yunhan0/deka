"use client";

import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import { deleteGoal } from "@/actions/goals";
import { GoalForm } from "@/components/goal-form";
import type { Category, Goal } from "@/types";

const PRIORITY_LABELS: Record<number, string> = {
  1: "High",
  2: "Med",
  3: "Low",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "text-red-500",
  2: "text-yellow-500",
  3: "text-muted-foreground",
};

export function GoalCard({
  goal,
  category,
  categories,
  profileId,
  year,
  blockNumber,
}: {
  goal: Goal;
  category: Category;
  categories: Category[];
  profileId: string;
  year: number;
  blockNumber: number;
}) {
  async function handleDelete() {
    if (!confirm("Delete this goal?")) return;
    await deleteGoal(goal.id);
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{goal.title}</span>
          <span className={`text-xs ${PRIORITY_COLORS[goal.priority]}`}>
            {PRIORITY_LABELS[goal.priority]}
          </span>
        </div>
        {goal.description && (
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        )}
        <CategoryBadge category={category} />
      </div>
      <div className="flex gap-1">
        <GoalForm
          profileId={profileId}
          year={year}
          blockNumber={blockNumber}
          categories={categories}
          goal={goal}
          trigger={
            <button className="inline-flex items-center justify-center rounded-lg px-2 h-7 text-xs font-medium hover:bg-muted transition-colors">
              Edit
            </button>
          }
        />
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
