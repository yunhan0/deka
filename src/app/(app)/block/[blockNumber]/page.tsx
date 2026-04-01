import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getBlockLabel, getBlockMonth } from "@/lib/blocks";
import { getGoalsForBlock } from "@/actions/goals";
import { getCategories } from "@/actions/categories";
import { GoalList } from "@/components/goal-list";
import { GoalForm } from "@/components/goal-form";
import Link from "next/link";

export default async function BlockDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ blockNumber: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { blockNumber: blockStr } = await params;
  const { year: yearStr } = await searchParams;
  const blockNumber = parseInt(blockStr, 10);
  const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();

  if (blockNumber < 1 || blockNumber > 36) {
    return <div>Invalid block number</div>;
  }

  // Get active profile
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("deka-profile")?.value;

  const userProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id));

  const activeProfileId =
    userProfiles.find((p) => p.id === profileCookie)?.id ??
    userProfiles.find((p) => p.isDefault)?.id ??
    userProfiles[0]?.id;

  if (!activeProfileId) redirect("/dashboard");

  const [goalData, allCategories] = await Promise.all([
    getGoalsForBlock(activeProfileId, year, blockNumber),
    getCategories(session.user.id),
  ]);

  const label = getBlockLabel(blockNumber, year);
  const month = getBlockMonth(blockNumber);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard?year=${year}`}
          className="inline-flex items-center justify-center rounded-lg px-2.5 h-7 text-sm font-medium hover:bg-muted transition-colors"
        >
          &larr; Back
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">
            Block {blockNumber} &middot; {label}
          </h2>
          <p className="text-sm text-muted-foreground">
            {month} {year}
          </p>
        </div>
        <GoalForm
          profileId={activeProfileId}
          year={year}
          blockNumber={blockNumber}
          categories={allCategories}
          trigger={
            <button className="inline-flex items-center justify-center rounded-lg border border-border bg-primary text-primary-foreground px-3 h-8 text-sm font-medium hover:bg-primary/80 transition-colors">
              + Add Goal
            </button>
          }
        />
      </div>

      <GoalList
        goals={goalData}
        categories={allCategories}
        profileId={activeProfileId}
        year={year}
        blockNumber={blockNumber}
      />
    </div>
  );
}
