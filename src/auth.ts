import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const PROFILE_COLORS = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#f97316",
];

function randomColor() {
  return PROFILE_COLORS[Math.floor(Math.random() * PROFILE_COLORS.length)];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      const existing = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.provider, account.provider),
            eq(users.providerId, account.providerAccountId)
          )
        )
        .get();

      if (!existing) {
        const newUser = await db
          .insert(users)
          .values({
            email: user.email,
            name: user.name,
            avatarUrl: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
          })
          .returning()
          .get();

        await db.insert(profiles).values({
          userId: newUser.id,
          name: "Me",
          color: randomColor(),
          isDefault: true,
        });
      } else {
        await db
          .update(users)
          .set({
            name: user.name,
            avatarUrl: user.image,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(users.id, existing.id));
      }

      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        const dbUser = await db
          .select()
          .from(users)
          .where(
            and(
              eq(users.provider, account.provider),
              eq(users.providerId, account.providerAccountId)
            )
          )
          .get();

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});
