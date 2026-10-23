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
    artist: "Studio A",
    art: "/images/docs/04.webp",
  },
  {
    artist: "Studio B",
    art: "/images/docs/05.webp",
  },
  {
    artist: "Studio C",
    art: "/images/docs/06.webp",
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
            <figcaption className="pt-2 text-xs text-start text-muted-foreground">
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
