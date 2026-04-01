"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCurrentBlock, getBlockLabel } from "@/lib/blocks";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profiles", label: "Profiles" },
  { href: "/categories", label: "Categories" },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { year, blockNumber } = getCurrentBlock();

  return (
    <aside className="flex w-56 flex-col border-r bg-muted/30 p-4">
      <Link href="/dashboard" className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Deka</h1>
      </Link>

      <div className="mb-6 rounded-lg bg-primary/10 p-3 text-sm">
        <p className="font-medium text-primary">Current Block</p>
        <p className="text-muted-foreground">
          Block {blockNumber} &middot; {getBlockLabel(blockNumber, year)}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
