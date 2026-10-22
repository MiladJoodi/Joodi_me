import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sonojs/ui/components/avatar"

export function AvatarBasic() {
  return (
    <Avatar>
      <AvatarImage src="/images/docs/01.webp" alt="User 1" />
      <AvatarFallback>U1</AvatarFallback>
    </Avatar>
  )
}
