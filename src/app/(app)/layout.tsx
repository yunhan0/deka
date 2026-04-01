import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NavSidebar } from "@/components/nav-sidebar";
import { Header } from "@/components/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id));

  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("deka-profile")?.value;

  // Use cookie profile if valid, otherwise default profile
  const activeProfileId =
    userProfiles.find((p) => p.id === profileCookie)?.id ??
    userProfiles.find((p) => p.isDefault)?.id ??
    userProfiles[0]?.id;

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header profiles={userProfiles} activeProfileId={activeProfileId} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
