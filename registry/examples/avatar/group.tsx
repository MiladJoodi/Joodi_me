import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@winkui/ui/components/avatar"

export function AvatarGroupExample() {
  return (
    <div className="flex flex-col gap-6">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/images/docs/01.webp" alt="User 1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/02.webp" alt="User 2" />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/03.webp" alt="User 3" />
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/images/docs/01.webp" alt="User 1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/02.webp" alt="User 2" />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/03.webp" alt="User 3" />
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/images/docs/01.webp" alt="User 1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/02.webp" alt="User 2" />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/images/docs/03.webp" alt="User 3" />
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <PlusIcon />
        </AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}
