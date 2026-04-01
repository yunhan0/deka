"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createGoal, updateGoal } from "@/actions/goals";
import type { Category, Goal } from "@/types";

const PRIORITIES = [
  { value: "1", label: "High" },
  { value: "2", label: "Medium" },
  { value: "3", label: "Low" },
];

export function GoalForm({
  profileId,
  year,
  blockNumber,
  categories,
  goal,
  trigger,
}: {
  profileId: string;
  year: number;
  blockNumber: number;
  categories: Category[];
  goal?: Goal;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(goal?.categoryId ?? null);
  const [priority, setPriority] = useState<string | null>(
    String(goal?.priority ?? 2)
  );
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (categoryId) formData.set("categoryId", categoryId);
    if (priority) formData.set("priority", priority);

    const result = goal
      ? await updateGoal(goal.id, formData)
      : await createGoal(profileId, year, blockNumber, formData);

    if ("success" in result) {
      setOpen(false);
      formRef.current?.reset();
      if (!goal) {
        setCategoryId(null);
        setPriority("2");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update your goal details." : "Add a goal to this block."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={goal?.title}
              placeholder="What do you want to achieve?"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              name="description"
              defaultValue={goal?.description ?? ""}
              placeholder="Any details..."
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        {cat.icon && <span>{cat.icon}</span>}
                        {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              {goal ? "Save Changes" : "Add Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
