import { Card, CardContent } from "@sonojs/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@sonojs/ui/components/carousel"

export function CarouselSpacing() {
  return (
    <div className="mx-auto w-full max-w-sm px-12">
      <Carousel className="w-full">
        <CarouselContent className="-ms-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="ps-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="py-0">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
