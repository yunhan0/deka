"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, or, isNull } from "drizzle-orm";

export async function getCategories(userId: string) {
  return db
    .select()
    .from(categories)
    .where(or(isNull(categories.userId), eq(categories.userId, userId)))
    .orderBy(categories.sortOrder);
}
