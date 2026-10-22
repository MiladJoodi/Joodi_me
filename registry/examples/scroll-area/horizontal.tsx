"use client"

import {
  ScrollArea,
  ScrollBar,
} from "@sonojs/ui/components/scroll-area"

interface Artwork {
  artist: string
  art: string
}

const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1d8021c3e9?w=300&dpr=2&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?w=300&dpr=2&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?w=300&dpr=2&q=80",
  },
]

export function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.art}
              alt={`Photo by ${artwork.artist}`}
              className="aspect-[3/4] h-40 w-fit rounded-md object-cover"
            />
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{" "}
              <span className="font-medium text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
