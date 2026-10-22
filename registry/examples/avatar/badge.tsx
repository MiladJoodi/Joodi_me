import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@winkui/ui/components/avatar"

export function AvatarBadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar>
        <AvatarImage src="/images/docs/01.webp" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <Avatar>
        <AvatarImage src="/images/docs/02.webp" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
        <AvatarBadge>
          <PlusIcon />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}
