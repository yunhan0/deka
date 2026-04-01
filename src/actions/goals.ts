"use server";

import { db } from "@/db";
import { goals, categories, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { goalSchema } from "@/lib/validators";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

async function verifyProfileOwnership(profileId: string): Promise<void> {
  const userId = await getAuthUserId();
  const profile = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .get();
  if (!profile) throw new Error("Profile not found");
}

async function verifyGoalOwnership(goalId: string): Promise<typeof goals.$inferSelect> {
  const userId = await getAuthUserId();
  const goal = await db
    .select()
    .from(goals)
    .where(eq(goals.id, goalId))
    .get();
  if (!goal) throw new Error("Goal not found");

  const profile = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, goal.profileId), eq(profiles.userId, userId)))
    .get();
  if (!profile) throw new Error("Unauthorized");

  return goal;
}

export async function getGoalsForBlock(
  profileId: string,
  year: number,
  blockNumber: number
) {
  return db
    .select({
      goal: goals,
      category: categories,
    })
    .from(goals)
    .innerJoin(categories, eq(goals.categoryId, categories.id))
    .where(
      and(
        eq(goals.profileId, profileId),
        eq(goals.year, year),
        eq(goals.blockNumber, blockNumber)
      )
    )
    .orderBy(goals.priority, goals.createdAt);
}

export async function createGoal(
  profileId: string,
  year: number,
  blockNumber: number,
  formData: FormData
) {
  await verifyProfileOwnership(profileId);

  const parsed = goalSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.insert(goals).values({
    profileId,
    year,
    blockNumber,
    title: parsed.data.title,
    description: parsed.data.description || null,
    categoryId: parsed.data.categoryId,
    priority: parsed.data.priority,
  });

  revalidatePath(`/block/${blockNumber}`);
  return { success: true };
}

export async function updateGoal(goalId: string, formData: FormData) {
  await verifyGoalOwnership(goalId);

  const parsed = goalSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const goal = await db.select().from(goals).where(eq(goals.id, goalId)).get();

  await db
    .update(goals)
    .set({
      title: parsed.data.title,
      description: parsed.data.description || null,
      categoryId: parsed.data.categoryId,
      priority: parsed.data.priority,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(goals.id, goalId));

  revalidatePath(`/block/${goal!.blockNumber}`);
  return { success: true };
}

export async function deleteGoal(goalId: string) {
  const goal = await verifyGoalOwnership(goalId);

  await db.delete(goals).where(eq(goals.id, goalId));

  revalidatePath(`/block/${goal.blockNumber}`);
  return { success: true };
}
