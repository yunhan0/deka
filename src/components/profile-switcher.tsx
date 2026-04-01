"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "@/types";

export function ProfileSwitcher({
  profiles,
  activeProfileId,
}: {
  profiles: Profile[];
  activeProfileId: string;
}) {
  const router = useRouter();

  async function handleSwitch(profileId: string | null) {
    if (!profileId) return;
    document.cookie = `deka-profile=${profileId};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <Select value={activeProfileId} onValueChange={handleSwitch}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select profile" />
      </SelectTrigger>
      <SelectContent>
        {profiles.map((profile) => (
          <SelectItem key={profile.id} value={profile.id}>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: profile.color }}
              />
              {profile.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
