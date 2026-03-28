export const dynamic = "force-dynamic";

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Deka</CardTitle>
        <CardDescription>
          36 blocks. 10 days each. Set goals. Get things done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" className="w-full" size="lg">
            Sign in with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
