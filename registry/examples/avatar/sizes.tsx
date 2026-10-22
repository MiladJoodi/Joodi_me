import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sonojs/ui/components/avatar"

export function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Avatar size="sm">
        <AvatarImage src="/images/docs/01.webp" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/images/docs/01.webp" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/images/docs/01.webp" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
    </div>
  )
}
