import { Skeleton } from "@sonojs/ui/components/skeleton"

export function SkeletonText() {
  return (
    <div className="w-full max-w-sm space-y-2 text-start">
      <Skeleton className="h-6 w-2/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}
