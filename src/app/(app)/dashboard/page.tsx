import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to Deka</h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as {session?.user?.name ?? session?.user?.email}
        </p>
      </div>
    </div>
  );
}
