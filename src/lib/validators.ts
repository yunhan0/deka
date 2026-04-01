import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().min(1, "Category is required"),
  priority: z.coerce.number().int().min(1).max(3),
});

export type GoalFormData = z.infer<typeof goalSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  icon: z.string().max(10).optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
