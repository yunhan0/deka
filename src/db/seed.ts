import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { categories } from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

const defaultCategories = [
  { name: "Health", color: "#22c55e", icon: "💪", sortOrder: 0 },
  { name: "Work", color: "#3b82f6", icon: "💼", sortOrder: 1 },
  { name: "Life", color: "#f59e0b", icon: "🌟", sortOrder: 2 },
  { name: "Learning", color: "#8b5cf6", icon: "📚", sortOrder: 3 },
  { name: "Finance", color: "#06b6d4", icon: "💰", sortOrder: 4 },
  { name: "Others", color: "#6b7280", icon: "📌", sortOrder: 5 },
];

async function seed() {
  console.log("Seeding default categories...");

  for (const cat of defaultCategories) {
    await db.insert(categories).values({
      userId: null,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
    });
  }

  console.log(`Seeded ${defaultCategories.length} default categories.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
